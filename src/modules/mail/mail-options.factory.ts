import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from './modules/adapter';

@Injectable()
export class MailOptionsFactory implements MailerOptionsFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly adapter: HandlebarsAdapter,
  ) {}

  async createMailerOptions(): Promise<MailerOptions> {
    return {
      ...this.config.get('mail.config'),
      template: {
        adapter: this.adapter,
      },
    }
  }
}
