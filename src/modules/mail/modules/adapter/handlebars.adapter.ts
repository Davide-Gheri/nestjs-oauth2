import { HandlebarsAdapter as MailerHandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as inlineCss from 'inline-css';
import path from 'path';
import fs from 'fs';
import { MailerOptions } from '@nestjs-modules/mailer';

@Injectable()
export class HandlebarsAdapter extends MailerHandlebarsAdapter implements OnModuleInit {
  private precompiledTemplate: Record<string, any>;

  private engine: any;
  private viewDirs: string;

  constructor(
    protected readonly host: HttpAdapterHost,
  ) {
    super();
  }

  onModuleInit(): any {
    const express = this.host.httpAdapter.getInstance<any>();
    this.engine = express.engines['.hbs'];
    this.viewDirs = path.join(express.get('views'));
  }

  async compile(mail: any, callback: any, mailerOptions: MailerOptions) {
    const settings = {
      views: this.viewDirs,
    };
    const body = await new Promise((resolve, reject) => {
      this.engine(
        path.join(this.viewDirs, 'mail', mail.data.template + '.hbs'),
        {
          ...mail.data.context,
          settings,
        },
        (err, value) => {
          if (err) {
            return reject(err);
          }
          return resolve(value);
        }
      );
    });
    mail.data.html = body;
    callback();
  }

  precompile(template: any, callback: any, options: any) {
    const templateExt = path.extname(template) || '.hbs';
    const templateName = path.basename(template, path.extname(template));
    const templateDir =
      path.dirname(template) !== '.'
        ? path.dirname(template)
        : options.dir || '';
    const templatePath = path.join(templateDir, templateName + templateExt);

    if (!this.precompiledTemplate[templateName]) {
      try {
        const template = fs.readFileSync(templatePath, 'UTF-8');

        this.precompiledTemplate[templateName] = '';
      } catch (err) {
        return callback(err);
      }
    }

    return {
      templateExt,
      templateName,
      templateDir,
      templatePath,
    };
  };
}
