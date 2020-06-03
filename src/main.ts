import session from 'express-session';
import sessionStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import passport from 'passport';
import hbs from 'express-handlebars';
import { resolve } from 'path';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { getConnectionToken } from '@app/lib/redis';

async function bootstrap() {
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

  app.set('view engine', 'hbs');
  app.engine('hbs', hbs({
    extname: 'hbs',
    layoutsDir: resolve(__dirname, '..', 'views/layouts/'),
    partialsDir: resolve(__dirname, '..', 'views/partials/'),
    defaultLayout: 'main',
    helpers: {
      jsonPretty: ctx => JSON.stringify(ctx, null, 2),
    },
  }));

  app.setBaseViewsDir(resolve(__dirname, '../views'));

  await app.listen(config.get('app.port'));
}
bootstrap();
