import { registerAs } from '@nestjs/config';
import { ConfigFactory } from '@nestjs/config/dist/interfaces';

export interface AppConfig {
  port: number;
  appUrl: string;
}

export const app = registerAs<ConfigFactory<AppConfig>>('app', () => ({
  port: +process.env.PORT || 5000,
  appUrl: process.env.APP_URL,
}))
