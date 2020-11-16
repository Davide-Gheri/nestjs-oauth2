import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { SignModuleAsyncOptions, SignModuleOptions, SignModuleOptionsFactory } from './interfaces';
import { SIGN_OPTIONS } from './constants';
import { UrlSignService } from './services';
import { SignedGuard } from '@app/lib/sign/guards';

@Module({
  providers: [
    UrlSignService,
    SignedGuard,
  ],
  exports: [
    UrlSignService,
    SignedGuard,
  ],
})
export class SignModule {
  static register(options: SignModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: SIGN_OPTIONS,
      useValue: options,
    };
    return {
      module: SignModule,
      providers: [optionsProvider],
      exports: [optionsProvider],
    }
  }

  static registerAsync(options: SignModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: SignModule,
      providers: asyncProviders,
      exports: asyncProviders,
    }
  }

  private static createAsyncProviders(options: SignModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<SignModuleOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: SignModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: SIGN_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: SIGN_OPTIONS,
      useFactory: async (optionsFactory: SignModuleOptionsFactory) => await optionsFactory.createSignOptions(),
      inject: [(options.useClass || options.useExisting) as Type<SignModuleOptionsFactory>],
    };
  }
}
