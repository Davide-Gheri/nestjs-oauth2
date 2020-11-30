import { AbstractGrant, InjectableGrant } from '../../common';
import { GrantTypes } from '@app/modules/oauth2/constants';
import { Request } from 'express';
import { TokenDto } from '@app/modules/oauth2/dto';
import { AccessTokenRequestResponse } from '@app/modules/oauth2/interfaces';
import { OAuthException } from '@app/modules/oauth2/errors';
import { OAuthAccessToken, OAuthRefreshToken, User } from '@app/entities';

@InjectableGrant(GrantTypes.refresh_token)
export class RefreshTokenServiceGrant extends AbstractGrant {
  async respondToAccessTokenRequest(req: Request, body: TokenDto): Promise<AccessTokenRequestResponse> {
    const client = await this.getClient(body, req);
    const scopes = this.validateScope(client, body.scopes);
    const oldRefreshToken = await this.refreshTokenService.getFromToken(body.refresh_token);
    const oldAccessToken = oldRefreshToken.accessToken;

    if (client.id !== oldAccessToken.clientId) {
      this.logger.warn(`Provided client ${client.id} does not match the accessToken ${oldAccessToken.id} client`);
      throw OAuthException.invalidClient();
    }

    scopes.forEach(scope => {
      if (!oldAccessToken.scopes.includes(scope)) {
        this.logger.warn(`Requested unauthorized scope ${scope}`);
        throw OAuthException.invalidScope(scope);
      }
    });

    return this.connection.transaction(async em => {
      const accessTokenRepo = em.getRepository(OAuthAccessToken);
      const refreshTokenRepo = em.getRepository(OAuthRefreshToken);
      const userRepo = em.getRepository(User);

      const accessToken = await this.issueAccessToken(client, oldAccessToken.userId, scopes, accessTokenRepo);
      const refreshToken = await this.issueRefreshToken(accessToken, oldRefreshToken.expiresAt, refreshTokenRepo);

      await this.accessTokenService.revoke(accessTokenRepo, oldAccessToken);
      await this.refreshTokenService.revoke(refreshTokenRepo, oldRefreshToken);

      return {
        accessToken,
        refreshToken,
        user: await userRepo.findOne(accessToken.userId),
      }
    });
  }
}
