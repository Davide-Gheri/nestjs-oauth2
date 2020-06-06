import { HandlebarsAdapter as MailerHandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HandlebarsAdapter extends MailerHandlebarsAdapter {

}
