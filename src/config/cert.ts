import { registerAs } from '@nestjs/config';
import { resolve } from 'path';

const baseCertPath = resolve(__dirname, '../../certs');

export const cert = registerAs('cert', () => ({
  baseCertPath,
}));
