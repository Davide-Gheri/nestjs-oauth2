import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CipherService } from '@app/lib/cipher';
import { TokenStrategy } from './strategy';

@Injectable()
export class AesStrategy implements TokenStrategy {
  constructor(
    private readonly config: ConfigService,
    private readonly cipherService: CipherService,
  ) {}

  async sign(payload: any): Promise<string> {
    return this.cipherService.encrypt({
      ...payload,
      iss: this.config.get('app.appUrl'),
    });
  }

  async verify<P = any>(encrypted: string): Promise<P> {
    return this.cipherService.decrypt(encrypted);
  }
}
