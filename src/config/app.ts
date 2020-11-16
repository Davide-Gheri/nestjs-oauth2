import { registerAs } from '@nestjs/config';

export const app = registerAs('app', () => ({
  port: +process.env.PORT || 5000,
  appUrl: process.env.APP_URL,

  shouldSendWelcomeEmail: false,

  security: {
    minPasswordScore: 2,
  },
}))
