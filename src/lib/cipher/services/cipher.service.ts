import { Inject, Injectable } from '@nestjs/common';
import crypto, { HexBase64Latin1Encoding } from 'crypto';
import farmhash from 'farmhash';
import forge from 'node-forge';
import { CIPHER_OPTIONS } from '../constants';
import { CipherModuleOptions } from '../interfaces';
import { hashValue, verifyValue } from '../hash';

/**
 * Cipher utilities
 */
@Injectable()
export class CipherService {
  protected readonly iv: any;

  protected readonly secret: string;

  constructor(
    @Inject(CIPHER_OPTIONS)
    protected readonly options: CipherModuleOptions,
  ) {
    this.iv = this.options.iv;
    this.secret = this.options.secret;
  }

  /**
   * Return a sha256 hash
   * @param data
   * @param digest
   */
  sha256(data: string, digest: HexBase64Latin1Encoding | boolean = 'hex'): string | Buffer {
    const hash = crypto.createHash('sha256')
      .update(data);
    if (digest) {
      return hash.digest(digest as HexBase64Latin1Encoding);
    }
    return hash.digest()
  }

  /**
   * Encrypt an object with AES-CBC algo
   * return his hex representation
   * @param data
   * @param secret
   * @param iv
   */
  encrypt(data: any, secret = this.secret, iv = this.iv): string {
    const cipher = forge.cipher.createCipher('AES-CBC', secret);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(JSON.stringify(data)));
    cipher.finish();

    return cipher.output.toHex();
  }

  /**
   * Decrypt an object encrypted with the AES-CBC algo
   * @param hexString
   * @param secret
   * @param iv
   */
  decrypt(hexString: string, secret = this.secret, iv = this.iv): any {
    const decipher = forge.cipher.createDecipher('AES-CBC', secret);
    decipher.start({ iv });
    decipher.update(forge.util.createBuffer(forge.util.hexToBytes(hexString)));
    decipher.finish();

    return JSON.parse(decipher.output.toString());
  }

  /**
   * Return a farmhash fingerprint32 of the passed data
   * @param data
   */
  farmHash(data: string) {
    return farmhash.fingerprint32(Buffer.from(data));
  }

  farmHashVerify(value: string, hashed: string | number) {
    const hashedValue = this.farmHash(value).toString();
    return hashedValue === hashed.toString();
  }

  /**
   * Hash a string using argon2
   * @param value
   */
  argonHash(value: string): Promise<string> {
    return hashValue(value, this.options.argon2Options);
  }

  /**
   * Verify a string with an argon2 hash
   * @param value
   * @param hashed
   */
  argonVerify(value: string, hashed: string): Promise<boolean> {
    return verifyValue(value, hashed, this.options.argon2Options);
  }
}
