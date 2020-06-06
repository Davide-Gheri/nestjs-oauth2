import { Module } from '@nestjs/common';
import { MailService } from '@app/modules/mail/services/mail.service';
import { BullModule } from '@nestjs/bull';
import { MAIL_QUEUE } from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailProcessor } from './processors/mail.processor';
import { MailOptionsFactory } from './mail-options.factory';
import { AdapterModule } from '@app/modules/mail/modules/adapter';
import { SignModule } from '@app/lib/sign';

@Module({
  imports: [
    ConfigModule,
    AdapterModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule, AdapterModule],
      inject: [ConfigService],
      useClass: MailOptionsFactory,
    }),
    BullModule.registerQueueAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: MAIL_QUEUE,
      useFactory: (config: ConfigService) => {
        return {
          redis: config.get('redis.ioredis'),
          name: MAIL_QUEUE,
          ...config.get('queue'),
        };
      },
    }),
    SignModule.register({
      secret: 'secret',
      ttl: 60 * 60 * 24,
    }),
  ],
  providers: [
    MailService,
    MailProcessor,
  ],
  exports: [
    MailService,
  ],
})
export class MailModule {}
