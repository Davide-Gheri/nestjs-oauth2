import session from 'express-session';
import sessionStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import passport from 'passport';
import hbs from 'hbs';
import { join, resolve } from 'path';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { getConnectionToken } from '@app/lib/redis';

export default async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bodyParser: false,
  });
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const secret = config.get('crypto.secret');
  const redis = app.get(getConnectionToken());
  const SessionStore = sessionStore(session);
  app.use(session({
    store: new SessionStore({ client: redis }),
    secret,
    resave: true,
    saveUninitialized: false,
  }));

  hbs.registerHelper('json', (ctx: any) => {
    delete ctx.settings;
    delete ctx.cache;
    delete ctx._locals;
    return JSON.stringify(ctx);
  });
  app.set('view engine', 'html');
  app.engine('html', hbs.__express);

  const clientDir = resolve(__dirname, '..', '..', '..', 'client');

  app.setBaseViewsDir(join(clientDir, 'views'));
  app.useStaticAssets(join(clientDir, 'build'), {
    // prefix: '/app',
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(secret));

  if (process.env.NODE_ENV === 'production') {
    app.use(rateLimit(config.get<any>('rateLimit')));
  }

  app.use(helmet());
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableShutdownHooks();

  await app.listen(config.get('app.port'));
}
