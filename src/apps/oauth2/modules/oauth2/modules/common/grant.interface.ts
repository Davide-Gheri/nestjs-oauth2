import { Request } from 'express';
import { AuthorizeDto, TokenDto } from '@app/modules/oauth2/dto';
import { OAuthAccessToken, OAuthClient, OAuthCode, OAuthRefreshToken } from '@app/entities';
import { AccessTokenRequestResponse } from '@app/modules/oauth2/interfaces';
import { GrantTypes } from '@app/modules/oauth2/constants';
import { AuthRequest } from '@app/modules/oauth2/auth.request';

export interface GrantInterface {
  getIdentifier(): GrantTypes;

  canRespondToAuthorizationRequest(query: Record<string, any>): boolean;

  respondToAccessTokenRequest(req: Request, body: TokenDto): Promise<AccessTokenRequestResponse>;

  issueAccessToken(
    client: OAuthClient,
    userId: string | null,
    scopes: string[]
  ): Promise<OAuthAccessToken>;

  issueRefreshToken(accessToken: OAuthAccessToken): Promise<OAuthRefreshToken>;

  createAuthRequest(data: AuthorizeDto): Promise<AuthRequest>;

  completeAuthRequest(authRequest: AuthRequest): Promise<OAuthCode>;
}
