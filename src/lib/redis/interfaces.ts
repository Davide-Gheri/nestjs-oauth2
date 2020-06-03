import { RedisOptions } from 'ioredis';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

export interface RedisModuleOptions {
  ioredis?: RedisOptions;
  url?: string;
  connectionName?: string;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface RedisOptionsFactory {
  createRedisOptions(connectionName?: string): Promise<RedisModuleOptions> | RedisModuleOptions;
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  connectionName?: string;
  useExisting?: Type<RedisOptionsFactory>;
  useClass?: Type<RedisOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
  inject?: any[];
}
