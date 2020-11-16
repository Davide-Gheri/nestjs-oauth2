import { DynamicModule, Module, Provider } from '@nestjs/common';
import { CipherService } from './services';
import { CIPHER_OPTIONS } from './constants';
import { CipherModuleOptions, CipherModuleAsyncOptions, CipherModuleOptionsFactory } from './interfaces';
import { RS256Generator } from './generators';

@Module({
  providers: [
    CipherService,
    RS256Generator,
  ],
  exports: [
    CipherService,
    RS256Generator,
  ],
})
export class CipherModule {
  static register(options: CipherModuleOptions): DynamicModule {
    return {
      module: CipherModule,
      providers: [
        {
          provide: CIPHER_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  static registerAsync(options: CipherModuleAsyncOptions): DynamicModule {
    return {
      module: CipherModule,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
    };
  }

  private static createAsyncProviders(options: CipherModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass!,
        useClass: options.useClass!,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: CipherModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: CIPHER_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: CIPHER_OPTIONS,
      useFactory: async (factory: CipherModuleOptionsFactory) => await factory.createCipherOptions(),
      inject: [options.useExisting! || options.useClass!],
    };
  }
}
