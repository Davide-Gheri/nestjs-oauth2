import { GrantTypes, ResponseModes, ResponseTypes, TokenAuthMethod } from '../generated/graphql';

const labelFromValue = (v: string) => v.toLowerCase().split('_').join(' ').replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

const mapFromEnum = (en: any) => Object.values(en).map((v: any) => ({
  value: v,
  label: labelFromValue(v),
}))

export const grantTypes = mapFromEnum(GrantTypes);

export const responseModes = mapFromEnum(ResponseModes);

export const responseTypes = mapFromEnum(ResponseTypes);

export const authMethods = mapFromEnum(TokenAuthMethod);

export const openIDScopes = [
  'openid', 'email', 'profile', 'offline_access',
];
