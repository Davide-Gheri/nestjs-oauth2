import { registerAs } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { resolve } from 'path';

export const mail = registerAs<ConfigFactory>('mail', () => ({
  config: {
    transport: defaultTransport(),
    defaults: {
      from: {
        name: process.env.MAIL_FROM_NAME || 'Argo',
        address: process.env.MAIL_FROM || 'ingo@argo.com',
      },
    },
    template: {
      dir: resolve(__dirname, '..', '..', 'views/mail'),
      options: {
        strict: true,
      },
    },
  },
  partials: [
    resolve(__dirname, '..', '..', 'views/partials'),
    resolve(__dirname, '..', '..', 'views/layouts')
  ],
  queue: {
    prefix: process.env.NODE_UID || 'argo',
    defaultJobOptions: {
      removeOnComplete: 10,
      attempts: 3,
    },
  },
}));

function defaultTransport(): MailerOptions['transport'] {
  const transport: MailerOptions['transport'] = {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10),
    secure: false,
    ignoreTLS: process.env.MAIL_SKIP_TLS === 'true',
  };
  if (process.env.MAIL_USERNAME) {
    transport.auth = {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD || null,
    };
  }
  return transport;
}
