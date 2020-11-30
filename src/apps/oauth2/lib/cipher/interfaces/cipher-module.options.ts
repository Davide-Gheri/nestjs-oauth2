import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { Options } from 'argon2';

export interface CipherModuleOptions {
  iv: string;
  secret: string;
  argon2Options?: Omit<Options, 'salt' | 'version'>;
}

export interface CipherModuleOptionsFactory {
  createCipherOptions(): Promise<CipherModuleOptions> | CipherModuleOptions;
}

export interface CipherModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<CipherModuleOptionsFactory>;
  useClass?: Type<CipherModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<CipherModuleOptions> | CipherModuleOptions;
  inject?: any[];
}
