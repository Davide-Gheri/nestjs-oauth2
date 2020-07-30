import { registerAs } from '@nestjs/config';
import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { Options } from 'express-rate-limit';

export const rateLimit = registerAs<ConfigFactory<Options>>('rateLimit', () => ({
  max: 0,
}));
