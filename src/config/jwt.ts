import { registerAs } from '@nestjs/config';
import { ConfigFactory } from '@nestjs/config/dist/interfaces';

export const jwt = registerAs<ConfigFactory<any>>('jwt', () => ({
  algorithm: 'RS256',
}));
