import { GrantTypes, ResponseModes, ResponseTypes, Scopes, TokenAuthMethod } from '@app/modules/oauth2/constants';

export class OpenIdConfig {
  private readonly response_types_supported: ResponseTypes[] = Object.values(ResponseTypes);
  private readonly grant_types_supported: GrantTypes[] = Object.values(GrantTypes);
  private readonly response_modes_supported: ResponseModes[] = Object.values(ResponseModes);
  private readonly scopes_supported: Scopes[] = Object.values(Scopes);
  private readonly token_endpoint_auth_methods_supported: TokenAuthMethod[] = Object.values(TokenAuthMethod);
  private readonly subject_types_supported: string[] = ['public'];

  issuer: string;
  authorization_endpoint: string;
  registration_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  userinfo_endpoint: string;
  revocation_endpoint: string;
  introspection_endpoint: string;

  constructor(baseUrl: string) {
    this.issuer = baseUrl;
    this.authorization_endpoint = new URL('/oauth2/authorize', baseUrl).toString();
    this.token_endpoint = new URL('/oauth2/token', baseUrl).toString();
    this.introspection_endpoint = new URL('/oauth2/introspect', baseUrl).toString();
    this.revocation_endpoint = new URL('/oauth2/revoke', baseUrl).toString();

    this.registration_endpoint = new URL('/clients', baseUrl).toString();
    this.jwks_uri = new URL('/.well-known/jwks.json', baseUrl).toString();
    this.userinfo_endpoint = new URL('/userinfo', baseUrl).toString();
  }

  toJson() {
    return JSON.stringify(this);
  }
}
