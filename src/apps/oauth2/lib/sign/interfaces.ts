import { SignatureOptions } from 'signed';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

export type SignModuleOptions = SignatureOptions;

export interface SignModuleOptionsFactory {
  createSignOptions(): SignModuleOptions | Promise<SignModuleOptions>;
}

export interface SignModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<SignModuleOptionsFactory>;
  useClass?: Type<SignModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<SignModuleOptions> | SignModuleOptions;
  inject?: any[];
}
