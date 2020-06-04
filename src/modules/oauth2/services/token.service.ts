import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenDto } from '../dto';
import { OAuthException } from '../errors';
import { AccessTokenJwtPayload, AccessTokenResponse, RefreshTokenData } from '../interfaces';
import { toEpochSeconds } from '@app/utils';
import { OAuthAccessToken, OAuthRefreshToken } from '@app/entities';
import { grantsWithIdToken, Scopes, TokenType } from '../constants';
import { OAuthService } from './oauth.service';

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

  public async decryptToken(encrypted: string, hint?: TokenType) {
    // Try to decrypt as JWT
    let decoded: AccessTokenJwtPayload | RefreshTokenData = await this.decryptJwt(encrypted);
    if (!decoded) {
      // Not a JWT, try to decrypt as AES-CBC
      decoded = this.decryptCipher(encrypted);
    }
    // Invalid token
    if (!decoded) {
      return { accessToken: null, decoded: null, refreshToken: null };
    }

    let token: OAuthAccessToken | OAuthRefreshToken;

    // If a token hint is passed use it to choose which repository to use to retrieve the token from the DB
    if (hint) {
      switch (hint) {
        case TokenType.ACCESS_TOKEN:
          if ('jti' in decoded) {
            token = await this.accessTokenRepository.findOne(decoded.jti);
          }
        break;
        case TokenType.REFRESH_TOKEN:
          if ('id' in decoded) {
            token = await this.refreshTokenRepository.findOne(decoded.id);
          }
        break;
      }
    // Else, try to determine the type
    } else if (isAccessTokenPayload(decoded)) {
      if ('jti' in decoded) {
        token = await this.accessTokenRepository.findOne(decoded.jti, {
          relations: ['user'],
        });
      }
    } else {
      token = await this.refreshTokenRepository.findOne(decoded.id);
    }
    return {
      token,
      decoded,
      isAccessToken: isAccessTokenPayload(decoded),
    };
  }

  /**
   * Verify token status
   * @param encrypted
   * @param hint
   */
  public async verifyToken(encrypted: string, hint?: TokenType) {
    const { isAccessToken, decoded, token } = await this.decryptToken(encrypted, hint);
    if (!decoded) {
      return {
        active: false,
      }
    }

    if (isAccessToken) {
      const accessToken = token as OAuthAccessToken;
      const payload = decoded as AccessTokenJwtPayload;

      const expired = payload.exp * 1000 < Date.now();
      /**
       * A token is valid if:
       * * the corresponding OAuthAccessToken exists in the DB
       * * is not expired
       * * is not revoked
       * * the issuer is this app
       */
      const active = !!accessToken && !expired && payload.iss === this.config.get('app.appUrl') && !accessToken.revoked;

      return {
        active,
        scope: accessToken.scopes.join(' '),
        client_id: accessToken.clientId,
        username: (await accessToken.user).email,
        exp: payload.exp,
      };
    } else {
      const refreshToken = token as OAuthRefreshToken;
      const payload = decoded as RefreshTokenData;

      const expired = payload.expiresAt * 1000 < Date.now();
      /**
       * A token is valid if:
       * * the corresponding OAuthRefreshToken exists in the DB
       * * is not expired
       * * is not revoked
       */
      const active = !!refreshToken && !expired && !refreshToken.revoked;

      return {
        active,
        exp: payload.expiresAt,
        client_id: refreshToken.accessToken.clientId,
      }
    }
  }

  /**
   * Revoke a valid token
   * @param token
   */
  public async revokeToken(token: OAuthAccessToken | OAuthRefreshToken) {
    token.revoked = true;
    token.revokedAt = new Date();
    if (isAccessToken(token)) {
      await this.accessTokenRepository.save(token);
    } else {
      await this.refreshTokenRepository.save(token);
    }
    return true;
  }

  protected async decryptJwt(token: string) {
    try {
      return await this.jwtService.verify(token, 'access_token');
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

function isAccessTokenPayload(decoded: AccessTokenJwtPayload | RefreshTokenData): decoded is AccessTokenJwtPayload {
  return !decoded.hasOwnProperty('accessTokenId');
}

function isAccessToken(token: OAuthAccessToken | OAuthRefreshToken): token is OAuthAccessToken {
  return !token.hasOwnProperty('accessTokenId');
}
