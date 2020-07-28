import { Injectable } from '@nestjs/common';
import { BaseTokenService } from '../../common/services/base-token.service';
import { OAuthClient, OAuthCode } from '@app/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCodeData } from '../../../interfaces';
import { CipherService } from '@app/lib/cipher';
import { OAuthException } from '@app/modules/oauth2/errors';
import { TokenAuthMethod } from '@app/modules/oauth2/constants';

@Injectable()
export class AuthCodeService extends BaseTokenService<OAuthCode> {
  constructor(
    @InjectRepository(OAuthCode)
    protected readonly repository: Repository<OAuthCode>,
    private readonly cipherService: CipherService,
  ) {
    super(repository);
  }

  public async create(
    repo = this.repository,
    clientId: string,
    userId: string,
    scopes: string[],
    redirectUri: string,
    ttl: number,
  ) {
    const authCode = repo.create({
      clientId,
      userId,
      scopes,
      redirectUri,
      expiresAt: this.getExpiration(ttl),
      revoked: false,
    });
    return repo.save(authCode);
  }

  public async getFromCode(code: string, client: OAuthClient, codeVerifier?: string): Promise<OAuthCode> {
    let authCodeData: AuthCodeData;
    try {
      authCodeData = this.cipherService.decrypt(code);
    } catch (e) {
      this.logger.error(`Cannot decrypt authorization code: ${e.message}`, e.stack);
      throw OAuthException.invalidRequest('code');
    }
    if ((authCodeData.expiresAt * 1000) < Date.now()) {
      this.logger.warn(`Authorization code ${authCodeData.id} expired`);
      throw OAuthException.invalidRequest('code');
    }

    if (client.canHandleAuthMethod(TokenAuthMethod.none)) {
      this.validateCodeChallenge(authCodeData, codeVerifier);
    }

    const authCode = await this.repository.findOne(authCodeData.id);
    if (!authCode) {
      this.logger.warn(`Authorization code ${authCode.id} not found`);
      throw OAuthException.invalidRequest('code');
    }
    if (authCode.expiresAt.getTime() < Date.now()) {
      this.logger.warn(`Authorization code ${authCode.id} expired`);
      throw OAuthException.invalidRequest('code');
    }
    if (authCode.revoked) {
      this.logger.warn(`Authorization code ${authCode.id} revoked`);
      throw OAuthException.invalidRequest('code');
    }
    return authCode;
  }

  protected validateCodeChallenge(
    authCodePayload: AuthCodeData,
    codeVerifier?: string,
  ) {
    if (!codeVerifier) {
      throw OAuthException.invalidRequest('code_verifier');
    }
    if (authCodePayload.codeChallengeMethod === 'plain' ) {
      if (authCodePayload.codeChallenge !== codeVerifier) {
        throw OAuthException.invalidCodeChallenge();
      }
    } else {
      const hash = this.cipherService.sha256(codeVerifier);
      const base64 = Buffer.from(hash).toString('base64');
      if (base64 !== authCodePayload.codeChallenge) {
        throw OAuthException.invalidCodeChallenge();
      }
    }
  }
}
