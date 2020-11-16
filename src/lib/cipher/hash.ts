import { Options, hash, verify, argon2id } from 'argon2';

const defaultConfig: Options = {
  type: argon2id,
  hashLength: 32,
  timeCost: 3,
  memoryCost: 4096,
  parallelism: 1,
  saltLength: 16,
}

/**
 * Argon2 hash wrapper
 * Cannot be inside the CipherService to be used outside the NestJs scope (ex. TypeOrm Entities)
 * @param value
 * @param options
 */
export function hashValue(value: string, options?: Options) {
  return hash(value, {
    ...defaultConfig,
    ...options,
    raw: false,
  });
}

/**
 * Argon2 verify wrapper
 * Cannot be inside the CipherService to be used outside the NestJs scope (ex. TypeOrm Entities)
 * @param value
 * @param hashed
 * @param options
 */
export function verifyValue(value: string, hashed: string, options?: Options) {
  return verify(hashed, value, {
    ...defaultConfig,
    ...options,
    raw: false,
  });
}
