import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenDto } from '../dto';
import { OAuthException } from '../errors';
import { AccessTokenJwtPayload, AccessTokenResponse, RefreshTokenData } from '../interfaces';
import { toEpochSeconds } from '@app/utils';
import { OAuthAccessToken, OAuthRefreshToken } from '@app/entities';
import { grantsWithIdToken, Scopes, TokenType } from '../constants';
import { OAuthService } from './oauth.service';

/**
 * Handles all Token related operations
 */
@Injectable()
export class TokenService extends OAuthService {
  /**
   * An access_token is requested, use the correct grant to issue it
   * return the access_token and, if requested, a refresh_token and an id_token
   * @param req
   * @param body
   */
  public async respondToAccessTokenRequest(req: Request, body: TokenDto) {
    const grant = this.grants.find(g => g.getIdentifier() === body.grant_type);
    if (!grant) {
      this.logger.warn(`Unknown grant ${body.grant_type}`);
      throw OAuthException.unsupportedGrantType();
    }
    /**
     * Use the requested grant to issue the token(s)
     */
    const { accessToken, user, refreshToken, scopes } = await grant.respondToAccessTokenRequest(req, body);

    const response: AccessTokenResponse = {
      type: 'Bearer',
      // Convert milliseconds to seconds
      expires_in: toEpochSeconds(accessToken.expiresAt.getTime() - Date.now()),
      // Use the configured access_token strategy to stringify it
      access_token: await this.tokenStrategy.sign(accessToken.toPayload()),
    };

    // issuing or not a refresh_token is delegated to the grant
    // if a refreshToken is found here, we need to issue it
    if (refreshToken) {
      response.refresh_token = this.cipherService.encrypt(refreshToken.toPayload());
    }

    // issuing or not an id_token is based on the requested scope and if the at is bound to an user
    if (this.shouldIssueIdToken(body, scopes) && user) {
      // Id tokens are always JWT
      response.id_token = await this.jwtService.sign({
        aud: accessToken.clientId,
        exp: toEpochSeconds(accessToken.expiresAt),
        sub: user.id,
        iss: this.config.get('app.appUrl'),
        ...accessToken.scopes.includes('email') && { email: user.email },
        ...accessToken.scopes.includes('profile') && user.toOpenIdProfile(body.scopes as Scopes[]),
      }, 'id_token');
    }

    return response;
  }

  /**
   * Check if the response should include an id_token
   * @param body
   * @param scopes
   */
  protected shouldIssueIdToken(body: TokenDto, scopes?: string[]): boolean {
    if (scopes) {
      return scopes.includes('openid') && grantsWithIdToken.includes(body.grant_type);
    }
    return body.scopes.includes('openid') && grantsWithIdToken.includes(body.grant_type);
  }

  /**
   * Decrypt the passed token using the configured access_token strategy or the cipher directly if is a refresh_token
   * @param encrypted
   * @param hint
   */
  public async decryptToken(encrypted: string, hint?: TokenType) {
    let decoded: AccessTokenJwtPayload | RefreshTokenData;
    try {
      decoded = await this.tokenStrategy.verify(encrypted);
    } catch (e) {
      // It could be a Refresh Token, try to decrypt it
      decoded = this.decryptCipher(encrypted);
      if (decoded) { // Found, force as refresh_token
        hint = TokenType.refresh_token;
      }
    }

    // Invalid token
    if (!decoded) {
      return { accessToken: null, decoded: null, refreshToken: null };
    }

    let token: OAuthAccessToken | OAuthRefreshToken;

    // If a token hint is passed, use it to choose which repository to use to retrieve the token from the DB
    if (hint) {
      switch (hint) {
        case TokenType.access_token:
          if ('jti' in decoded) {
            token = await this.accessTokenRepository.findOne({
              id: decoded.jti,
              revoked: false,
            }, { relations: ['user'] });
          }
        break;
        case TokenType.refresh_token:
          if ('id' in decoded) {
            token = await this.refreshTokenRepository.findOne({
              id: decoded.id,
              revoked: false,
            });
          }
        break;
      }
    // Else, try to determine the type
    } else if (isAccessTokenPayload(decoded)) {
      if ('jti' in decoded) {
        token = await this.accessTokenRepository.findOne({
          id: decoded.jti,
          revoked: false,
        }, { relations: ['user'] });
      }
    } else {
      token = await this.refreshTokenRepository.findOne({
        id: decoded.id,
        revoked: false,
      });
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
       * An access_token is valid if:
       * * the corresponding OAuthAccessToken exists in the DB
       * * is not expired
       * * is not revoked
       * * the issuer is this app
       */
      const active = !!accessToken && !expired && payload.iss === this.config.get('app.appUrl') && !accessToken.revoked;

      return {
        active,
        scope: accessToken && accessToken.scopes.join(' '),
        client_id: accessToken && accessToken.clientId,
        username: accessToken && (await accessToken.user).email,
        exp: payload.exp,
      };
    } else {
      const refreshToken = token as OAuthRefreshToken;
      const payload = decoded as RefreshTokenData;

      const expired = payload.expiresAt * 1000 < Date.now();
      /**
       * A refresh_token is valid if:
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
