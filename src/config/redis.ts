import { registerAs } from '@nestjs/config';
import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { RedisModuleOptions } from '@app/lib/redis';

export const redis = registerAs<ConfigFactory<RedisModuleOptions>>('redis', () => ({
  ioredis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  },
}))
