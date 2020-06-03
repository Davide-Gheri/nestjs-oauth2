import { registerAs } from '@nestjs/config';

export const oauth = registerAs('oauth', () => ({
  authCodeTTL: 3600,
  accessTokenTTL: 36000,
  refreshTokenTTL: 3600000,

  accessTokenType: 'jwt',
}));
