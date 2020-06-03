
export enum GrantTypes {
  PASSWORD = 'password',
  AUTHORIZATION_CODE = 'authorization_code',
  REFRESH_TOKEN = 'refresh_token',
  CLIENT_CREDENTIALS = 'client_credentials',
}

export const grantsWithRefreshToken = [
  GrantTypes.PASSWORD,
  GrantTypes.AUTHORIZATION_CODE,
  GrantTypes.REFRESH_TOKEN,
  GrantTypes.CLIENT_CREDENTIALS,
];

export const grantsWithIdToken = [
  GrantTypes.PASSWORD,
  GrantTypes.AUTHORIZATION_CODE,
  GrantTypes.REFRESH_TOKEN,
];

export enum ResponseModes {
  QUERY = 'query',
  FRAGMENT = 'fragment',
  FORM_POST = 'form_post',
}

export enum ResponseTypes {
  CODE = 'code',
}

export enum PromptTypes {
  NONE = 'none',
  LOGIN = 'login',
  CONSENT = 'consent',
}

export enum DisplayTypes {
  PAGE = 'page',
  POPUP = 'popup',
}

export enum Scopes {
  OPENID = 'openid',
  EMAIL = 'email',
  PROFILE = 'profile',
  OFFLINE_ACCESS = 'offline_access',
}

export enum TokenAuthMethod {
  CLIENT_SECRET_POST = 'client_secret_post',
  CLIENT_SECRET_BASIC = 'client_secret_basic',
  NONE = 'none',
}
