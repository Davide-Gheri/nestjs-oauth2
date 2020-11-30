import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Key } from '@app/entities';
import { Repository } from 'typeorm';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { CipherService } from '@app/lib/cipher';
import { JWT, JWK, JWKS } from 'jose';

type KeyUnion = JWK.RSAKey | JWK.ECKey | JWK.OKPKey | JWK.OctKey

/**
 * Common JWT manipulations
 * Retrieve the RSA key pair needed to sign/verify tokens from the DB
 */
@Injectable()
export class JwtService {
  constructor(
    private readonly config: ConfigService,
    private readonly cipher: CipherService,
    @InjectRepository(Key)
    private readonly keyRepository: Repository<Key>,
  ) {}

  /**
   * Convert the encrypted data stored in the DB to an usable RSA key
   * @param keyData
   */
  private asKey(keyData: string) {
    return JWK.asKey({
      key: this.cipher.decrypt(keyData),
      format: 'pem',
    }, {
      alg: 'RS256',
      use: 'sig',
    });
  }

  /**
   * Retrieve a key from the db
   * @param name
   * @param type
   */
  private async getKey(name: string, type: 'public' | 'private'): Promise<KeyUnion> {
    const key = await this.keyRepository.findOne({
      name,
      type,
    });
    if (!key) {
      throw new RuntimeException(`${type} key ${name} not found`);
    }
    return this.asKey(key.data);
  }

  /**
   * Sign a payload using the private key with the given name
   * @param payload
   * @param keyName
   */
  async sign(payload: any, keyName: string) {
    const key = await this.getKey(keyName, 'private');
    return JWT.sign(payload, key, {
      algorithm: this.config.get('jwt.algorithm'),
      notBefore: '0s',
      issuer: this.config.get('app.appUrl'),
    });
  }

  /**
   * Verify a JWT using the public key with the given name
   * @param token
   * @param keyName
   */
  async verify<P = any>(token: string, keyName: string): Promise<P> {
    const key = await this.getKey(keyName, 'public');
    return JWT.verify(token, key, {
      algorithms: [this.config.get('jwt.algorithm')],
      issuer: this.config.get('app.appUrl'),
    }) as any as P;
  }

  /**
   * Decode a JWT without validating it
   * @param token
   */
  decode<P = any>(token: string): P {
    return JWT.decode(token) as any as P;
  }

  /**
   * Return a JSON Web Key representation of the key with the given name and type
   * @param keyName
   * @param type
   */
  async jwk(keyName: string, type: 'public' | 'private' = 'public') {
    const key = await this.getKey(keyName, type);
    return key.toJWK(type === 'private');
  }

  /**
   * Return a JSON Web Key Set of all the keys that matches the passed filters
   * @param name
   * @param type
   */
  async jwks(name?: string, type?: 'public' | 'private') {
    const filters = {
      ...name && {name},
      ...type && {type},
    };
    const keys = await this.keyRepository.find(filters);
    const store = new JWKS.KeyStore();
    keys.forEach(key => {
      const rsaKey = this.asKey(key.data);
      store.add(rsaKey);
    });
    return store.toJWKS(type === 'private');
  }
}
