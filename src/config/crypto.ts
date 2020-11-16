import { registerAs } from '@nestjs/config';
import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { CipherModuleOptions } from '@app/lib/cipher';

export const crypto = registerAs<ConfigFactory<CipherModuleOptions>>('crypto', () => ({
  iv: process.env.APP_IV || '1234567890123456',
  secret: process.env.APP_SECRET || '12345678901234567890123456789012',
}));
