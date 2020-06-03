import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenDto } from '../dto';
import { OAuthException } from '../errors';
import { AccessTokenJwtPayload, AccessTokenResponse, RefreshTokenData } from '../interfaces';
import { toEpochSeconds } from '@app/utils';
import { OAuthAccessToken } from '@app/entities';
import { grantsWithIdToken } from '../constants';
import { OAuthService } from './oauth.service';
import { Scopes } from '../constants';

@Injectable()
export class TokenService extends OAuthService {
  public async respondToAccessTokenRequest(req: Request, body: TokenDto) {
    const grant = this.grants.find(g => g.getIdentifier() === body.grant_type);
    if (!grant) {
      this.logger.warn(`Unknown grant ${body.grant_type}`);
      throw OAuthException.unsupportedGrantType();
    }
    const { accessToken, user, refreshToken } = await grant.respondToAccessTokenRequest(req, body);

    const response: AccessTokenResponse = {
      type: 'Bearer',
      expires_in: toEpochSeconds(accessToken.expiresAt.getTime() - Date.now()),
      access_token: await this.stringifyToken(accessToken),
    };

    if (refreshToken) {
      response.refresh_token = this.cipherService.encrypt(refreshToken.toPayload());
    }

    if (this.shouldIssueIdToken(body) && user) {
      response.id_token = await this.jwtService.sign({
        aud: accessToken.clientId,
        exp: toEpochSeconds(accessToken.expiresAt),
        sub: user.id,
        ...accessToken.scopes.includes('email') && { email: user.email },
        ...accessToken.scopes.includes('profile') && user.toOpenIdProfile(body.scopes as Scopes[]),
      }, 'id_token');
    }

    return response;
  }

  protected shouldIssueIdToken(body: TokenDto): boolean {
    return body.scopes.includes('openid') && grantsWithIdToken.includes(body.grant_type);
  }

  protected stringifyToken(token: OAuthAccessToken) {
    switch (this.config.get('oauth.accessTokenType') || 'jwt') {
      case 'jwt':
        return this.jwtService.sign(token.toPayload(), 'access_token');
      case 'code':
        return this.cipherService.encrypt(token.toPayload());
    }
  }

  /**
   * Verify token status
   * @param token
   */
  public async verifyToken(token: string) {
    // Try to decrypt as JWT
    let decoded: AccessTokenJwtPayload = await this.decryptJwt(token);
    if (!decoded) {
      // Not a JWT, try to decrypt as AES-CBC
      decoded = this.decryptCipher(token);
    }
    // Invalid token
    if (!decoded) {
      return {
        active: false,
      }
    }
    const accessToken = await this.accessTokenRepository.findOne(decoded.jti, {
      relations: ['user'],
    });
    const expired = decoded.exp * 1000 < Date.now();
    /**
     * A token is valid if:
     * * the corresponding OAuthAccessToken exists in the DB
     * * is not expired
     * * is not revoked
     * * the issuer is this app
     */
    const active = !!accessToken && !expired && decoded.iss === this.config.get('app.appUrl') && !accessToken.revoked;

    return {
      active,
      scope: accessToken.scopes.join(' '),
      client_id: accessToken.clientId,
      username: (await accessToken.user).email,
      exp: decoded.exp,
    };
  }

  protected decryptJwt(token: string) {
    try {
      return this.jwtService.verify(token, 'access_token');
    } catch (e) {
      return false;
    }
  }

  protected decryptCipher(token: string) {
    try {
      return this.cipherService.decrypt(token);
    } catch (e) {
      return false;
    }
  }
}
