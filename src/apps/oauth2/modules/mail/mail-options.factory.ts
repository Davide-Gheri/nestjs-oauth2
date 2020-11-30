import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from './modules/adapter';
import { join } from "path";

@Injectable()
export class MailOptionsFactory implements MailerOptionsFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly adapter: HandlebarsAdapter,
  ) {}

  async createMailerOptions(): Promise<MailerOptions> {
    const config = this.config.get('mail.config');
    return {
      ...config,
      template: {
        adapter: this.adapter,
        ...config.template,
      },
    }
  }
}
