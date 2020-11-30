import { HandlebarsAdapter as MailerHandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';
import handlebars from 'handlebars';
import hbsLayouts from 'handlebars-layouts';
import path from 'path';
import fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

@Injectable()
export class HandlebarsAdapter extends MailerHandlebarsAdapter {
  constructor(
    private readonly config: ConfigService,
  ) {
    super();

    const partialsDirs = config.get('mail.partials');

    handlebars.registerHelper(hbsLayouts(handlebars));

    handlebars.registerHelper('currentYear', () => (new Date()).getFullYear());

    partialsDirs.forEach(this.registerDir);
  }

  registerDir(dir: string) {
    fs.readdirSync(dir).forEach(file => {
      const name = path.parse(file).name;
      handlebars.registerPartial(name, fs.readFileSync(path.resolve(dir, file), 'utf8'));
    });
  }
}
