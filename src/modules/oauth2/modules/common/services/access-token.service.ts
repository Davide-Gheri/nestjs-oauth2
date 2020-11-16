import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuthAccessToken } from '@app/entities';
import { Repository } from 'typeorm';
import { GrantTypes } from '@app/modules/oauth2/constants';
import { BaseTokenService } from './base-token.service';

@Injectable()
export class AccessTokenService extends BaseTokenService<OAuthAccessToken> {
  constructor(
    @InjectRepository(OAuthAccessToken)
    protected readonly repository: Repository<OAuthAccessToken>,
  ) {
    super(repository);
  }

  create(
    repo = this.repository,
    clientId: string,
    userId: string | null,
    scopes: string[],
    grantType: GrantTypes,
    ttl: number,
  ) {
    const accessToken = repo.create({
      clientId,
      userId,
      scopes,
      revoked: false,
      grantType,
      expiresAt: this.getExpiration(ttl),
    });
    return repo.save(accessToken);
  }
}
