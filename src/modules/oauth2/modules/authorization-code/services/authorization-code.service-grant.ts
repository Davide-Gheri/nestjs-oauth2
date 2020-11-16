import { InjectableGrant } from '../../common/decorators';
import { GrantTypes } from '@app/modules/oauth2/constants';
import { AbstractGrant } from '../../common';
import { Request } from 'express';
import { TokenDto, AuthorizeDto } from '@app/modules/oauth2/dto';
import { AccessTokenRequestResponse } from '@app/modules/oauth2/interfaces';
import { AuthRequest } from '@app/modules/oauth2/auth.request';
import { OAuthException } from '@app/modules/oauth2/errors';
import { OAuthClient, OAuthCode, User } from '@app/entities';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { Repository } from 'typeorm';
import { AuthCodeService } from './auth-code.service';

@InjectableGrant(GrantTypes.authorization_code)
export class AuthorizationCodeServiceGrant extends AbstractGrant {
  constructor(
    protected readonly authCodeService: AuthCodeService,
  ) {
    super();
  }

  canRespondToAuthorizationRequest(query: Record<string, any>): boolean {
    return true;
  }

  async createAuthRequest(data: AuthorizeDto): Promise<AuthRequest> {
    const client = await this.getClient(data, null, false);
    if (!client.canHandleResponseType(data.response_type)) {
      this.logger.warn(`Client ${client.id} cannot handle ${data.response_type} response type`);
      throw OAuthException.invalidRequest('response_type');
    }
    if (!client.canHandleResponseMode(data.response_mode)) {
      this.logger.warn(`Client ${client.id} cannot handle ${data.response_mode} response mode`);
      throw OAuthException.invalidRequest('response_mode');
    }
    const scopes = this.validateScope(client, data.scopes);
    const redirectTo = this.validateRedirectUri(data.redirect_uri, client);

    return new AuthRequest({
      grantTypeId: this.getIdentifier(),
      client: client,
      redirectUri: redirectTo,
      state: data.state,
      scopes,
      responseMode: data.response_mode,
      responseType: data.response_type,
      ...(data.code_challenge && data.code_challenge_method) && {
        codeChallenge: data.code_challenge,
        codeChallengeMethod: data.code_challenge_method,
      }
    });
  }

  async completeAuthRequest(authRequest: AuthRequest): Promise<OAuthCode> {
    if (!authRequest.user) {
      throw new RuntimeException('An instance of User should be set on the AuthRequest');
    }
    if (authRequest.approved) {
      return this.issueAuthCode(
        authRequest.client,
        authRequest.user,
        authRequest.redirectUri,
        authRequest.scopes,
      );
    }
    throw OAuthException.accessDenied('The user denied the request');
  }

  async respondToAccessTokenRequest(req: Request, body: TokenDto): Promise<AccessTokenRequestResponse> {
    const client = await this.getClient(body, req);
    const authCode = await this.authCodeService.getFromCode(body.code, client, body.code_verifier);
    const scopes = this.validateScope(client, body.scopes).filter(scope => authCode.scopes.includes(scope));

    if (authCode.clientId !== client.id) {
      this.logger.warn(`Authorization code ${authCode.id} do not belongs to the client ${client.id}`);
      throw OAuthException.invalidRequest('code');
    }
    await this.validateRedirectUri(body.redirect_uri, client, authCode);

    return this.connection.transaction(async em => {
      const response = await this.returnAccessTokenResponse({ em, user: authCode.user, client, body, scopes });

      const authCodeRepo = em.getRepository(OAuthCode);
      await this.authCodeService.revoke(authCodeRepo, authCode);

      response.scopes = scopes;

      return response;
    })
  }

  protected issueAuthCode(
    client: OAuthClient,
    user: User,
    redirectUri: string,
    scopes: string[],
    repo?: Repository<OAuthCode>,
  ) {
    return this.authCodeService.create(
      repo,
      client.id,
      user.id,
      scopes,
      redirectUri,
      this.config.get('oauth.authCodeTTL'),
    );
  }

  protected validateRedirectUri(uri: string, client: OAuthClient, authCode?: OAuthCode) {
    if (!client.redirect.includes(uri)) {
      this.logger.warn(`Redirect uri ${uri} do not belongs to client ${client.id}`);
      throw OAuthException.invalidGrant();
    }
    if (authCode && authCode.redirectUri !== uri) {
      this.logger.warn(`Redirect uri ${uri} do not match to one issued for code ${authCode.id}`);
      throw OAuthException.invalidGrant();
    }
    return uri;
  }
}
