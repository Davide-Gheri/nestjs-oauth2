import { registerAs } from '@nestjs/config';
import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { ConnectionOptions } from 'typeorm';

// tslint:disable-next-line:no-var-requires
const defaults = require('../../ormconfig');

export const db = registerAs<ConfigFactory<ConnectionOptions>>('db', () => ({
  ...defaults,
  logging: process.env.NODE_LOG === 'debug',
  autoLoadEntities: true,
  entities: null,
  retryAttempts: 20,
  retryDelay: 5000,
}));
