import { registerAs } from '@nestjs/config';
import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { ConnectionOptions } from 'typeorm';

export const db = registerAs<ConfigFactory<ConnectionOptions>>('db', () => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: true,
}));
