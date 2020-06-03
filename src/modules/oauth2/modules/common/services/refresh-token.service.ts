import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuthRefreshToken } from '@app/entities';
import { Repository } from 'typeorm';
import { CipherService } from '@app/lib/cipher';
import { OAuthException } from '@app/modules/oauth2/errors';
import { RefreshTokenData } from '@app/modules/oauth2/interfaces';
import { BaseTokenService } from './base-token.service';

@Injectable()
export class RefreshTokenService extends BaseTokenService<OAuthRefreshToken> {
  constructor(
    @InjectRepository(OAuthRefreshToken)
    protected readonly repository: Repository<OAuthRefreshToken>,
    private readonly cipherService: CipherService,
  ) {
    super(repository);
  }

  public create(
    repo = this.repository,
    accessTokenId: string,
    ttl: number,
    overrideExpiration?: Date,
  ) {
    const accessToken = repo.create({
      accessTokenId,
      revoked: false,
      expiresAt: overrideExpiration || this.getExpiration(ttl),
    });
    return repo.save(accessToken);
  }

  public async getFromToken(token: string) {
    let refreshTokenData: RefreshTokenData;
    try {
      refreshTokenData = this.cipherService.decrypt(token);
    } catch (e) {
      this.logger.error(`Cannot decrypt refresh token: ${e.message}`, e.stack);
      throw OAuthException.invalidRefreshToken();
    }
    if ((refreshTokenData.expiresAt * 1000) < Date.now()) {
      this.logger.warn(`Refresh token ${refreshTokenData.id} expired`);
      throw OAuthException.invalidRefreshToken('Token expired');
    }
    const refreshToken = await this.repository.findOne(refreshTokenData.id);
    if (!refreshToken) {
      this.logger.warn(`Refresh token ${refreshTokenData.id} not found`);
      throw OAuthException.invalidRequest('refresh_token');
    }
    if (refreshToken.revoked) {
      this.logger.warn(`Refresh token ${refreshToken.id} revoked`);
      throw OAuthException.invalidRefreshToken('Token revoked');
    }
    return refreshToken;
  }
}
