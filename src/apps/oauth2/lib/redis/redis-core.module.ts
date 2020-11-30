import {
  DynamicModule, Global, Inject, Module, OnApplicationShutdown, Provider, Type,
} from '@nestjs/common';
import { defer } from 'rxjs';
import Redis from 'ioredis';
import { ModuleRef } from '@nestjs/core';
import { RedisModuleAsyncOptions, RedisModuleOptions, RedisOptionsFactory } from './interfaces';
import { getConnectionToken, handleRetry } from './utils';
import { REDIS_MODULE_OPTIONS } from './constants';

@Global()
@Module({})
export class RedisCoreModule implements OnApplicationShutdown {
  constructor(
    @Inject(REDIS_MODULE_OPTIONS)
    private readonly options: RedisModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    const connection = this.moduleRef.get<Redis.Redis>(getConnectionToken(this.options.connectionName));
    if (connection) {
      await connection.disconnect();
    }
  }

  static forRoot(options: RedisModuleOptions = {}): DynamicModule {
    const redisModuleOptions: Provider = {
      provide: REDIS_MODULE_OPTIONS,
      useValue: options,
    };
    const connectionProvider: Provider = {
      provide: getConnectionToken(options.connectionName),
      useFactory: async () => await this.createConnectionFactory(options),
    };
    return {
      module: RedisCoreModule,
      providers: [
        connectionProvider,
        redisModuleOptions,
      ],
      exports: [
        connectionProvider,
      ],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const connectionProvider: Provider = {
      provide: getConnectionToken(options.connectionName),
      useFactory: async (redisOptions: RedisModuleOptions) => {
        if (options.connectionName) {
          return await this.createConnectionFactory({
            ...redisOptions,
            connectionName: options.connectionName,
          });
        }
        return await this.createConnectionFactory(redisOptions);
      },
      inject: [REDIS_MODULE_OPTIONS],
    };
    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: RedisCoreModule,
      imports: options.imports || [],
      providers: [
        ...asyncProviders,
        connectionProvider,
      ],
      exports: [connectionProvider],
    };
  }

  private static createAsyncProviders(options: RedisModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<RedisOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: RedisModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: REDIS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: REDIS_MODULE_OPTIONS,
      useFactory: async (optionsFactory: RedisOptionsFactory) => await optionsFactory.createRedisOptions(options.connectionName),
      inject: [(options.useClass || options.useExisting) as Type<RedisOptionsFactory>],
    };
  }

  private static async createConnectionFactory(options: RedisModuleOptions) {
    return defer(() => new Promise((resolve, reject) => {
      let redis: Redis.Redis;
      if (typeof options.url === 'string') {
        redis = new Redis(options.url, options.ioredis);
      } else {
        redis = new Redis(options.ioredis);
      }
      redis.on('connect', () => {
        resolve(redis);
      });
      redis.on('error', (error) => {
        reject(error);
      });
    }))
    .pipe(handleRetry(options.retryAttempts, options.retryDelay))
    .toPromise();
  }
}
