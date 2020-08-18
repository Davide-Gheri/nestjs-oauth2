
export enum GrantTypes {
  password = 'password',
  authorization_code = 'authorization_code',
  refresh_token = 'refresh_token',
  client_credentials = 'client_credentials',
}

export const grantsWithRefreshToken = [
  GrantTypes.password,
  GrantTypes.authorization_code,
  GrantTypes.refresh_token,
  GrantTypes.client_credentials,
];

export const grantsWithIdToken = [
  GrantTypes.password,
  GrantTypes.authorization_code,
  GrantTypes.refresh_token,
];

export enum ResponseModes {
  query = 'query',
  fragment = 'fragment',
  form_post = 'form_post',
}

export enum ResponseTypes {
  code = 'code',
}

export enum PromptTypes {
  none = 'none',
  login = 'login',
  consent = 'consent',
}

export enum DisplayTypes {
  page = 'page',
  popup = 'popup',
}

export enum Scopes {
  openid = 'openid',
  email = 'email',
  profile = 'profile',
  offline_access = 'offline_access',
}

export enum ApiScopes {
  users_profile = 'users:profile',
  users_email = 'users:email',
}

export enum TokenAuthMethod {
  client_secret_post = 'client_secret_post',
  client_secret_basic = 'client_secret_basic',
  none = 'none',
}

export enum TokenType {
  access_token = 'access_token',
  refresh_token = 'refresh_token',
}
