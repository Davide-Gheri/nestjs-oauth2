import { Injectable } from '@nestjs/common';
import { promises } from 'fs';
import { ConfigService } from '@nestjs/config';
import forge from 'node-forge';
import { resolve } from 'path';

@Injectable()
export class RS256Generator {
  constructor(
    private readonly config: ConfigService,
  ) {}

  private keyLength = 4096;

  setKeyLength(kl: number) {
    this.keyLength = kl;
    return this;
  }

  /**
   * Generate an RSA key pair
   */
  generateKeyPair(): Promise<forge.pki.KeyPair> {
    return new Promise((resolve, reject) => {
      forge.pki.rsa.generateKeyPair(this.keyLength, 0x10001, (err, keyPair) => {
        if (err) {
          return reject(err);
        }
        resolve(keyPair);
      })
    });
  }

  /**
   * Save an RSA key pair to file
   * @param keyPair
   * @param out
   * @param pubOut
   * @param privOut
   */
  async persist(
    keyPair: forge.pki.KeyPair,
    out = this.config.get('cert.baseCertPath'),
    pubOut = 'public.key',
    privOut = 'private.key') {
    await promises.writeFile(
      resolve(out, pubOut),
      forge.pki.publicKeyToPem(keyPair.publicKey),
    );
    await promises.writeFile(
      resolve(out, privOut),
      forge.pki.privateKeyToPem(keyPair.privateKey),
    );
  }
}
