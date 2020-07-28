import { OAuthAccessToken, OAuthRefreshToken, User } from '../../../entities';
import { TokenAuthMethod } from '@app/modules/oauth2/constants';

export type CredentialTuple = [string | null, string | null];

export interface ClientCredentials {
  clientId: string;
  clientSecret: string;
  type: TokenAuthMethod;
}

export interface AccessTokenRequestResponse {
  accessToken: OAuthAccessToken;
  refreshToken?: OAuthRefreshToken;
  user?: User;
  scopes?: string[];
}

export interface AccessTokenResponse {
  type: 'Bearer';
  expires_in: number;
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
}

export interface AccessTokenJwtPayload {
  aud: string;
  jti: string;
  exp: number;
  sub: string;
  scopes: string[];
  iss?: string;
}

export interface RefreshTokenData {
  id: string;
  accessTokenId: string;
  expiresAt: number;
}

export interface IdTokenJwtPayload {
  aud: string;
  iat: number;
  nbf: number;
  exp: number;
  sub: string;
  email?: string;
  [key: string]: any;
}

export interface AuthCodeData {
  id: string;
  expiresAt: number;
  codeChallenge?: string;
  codeChallengeMethod?: string;
}

export interface AuthCodeResponse {
  code: string;
  returnTo: string;
  state: string;
}
