import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as configs from '@config';
import * as entities from './entities';
import { RedisModule } from '@app/lib/redis';
import { AuthModule, roles } from './modules/auth';
import { OAuth2Module } from './modules/oauth2/oauth2.module';
import { OpenIdModule } from './modules/openid/open-id.module';
import { UserModule } from '@app/modules/user';
import { MailModule } from '@app/modules/mail';
import csurf from "csurf";
import { ManagementApiModule } from '@app/modules/management-api';
import { AccessControlModule } from 'nest-access-control';
import { UserApiModule } from '@app/modules/user-api/user-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Object.values(configs),
    }),
    AccessControlModule.forRoles(roles),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {

        return {
          ...config.get('db'),
          entities: Object.values(entities),
        };
      },
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('redis'),
    }),
    MailModule,
    AuthModule,
    OAuth2Module,
    OpenIdModule,
    UserModule,
    ManagementApiModule,
    UserApiModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(csurf({ cookie: true }))
    .exclude(
      'oauth2/token',
      'oauth2/introspect',
      'oauth2/revoke',
      'oauth2/userinfo',
      'debug/(.*)',
      'api/graphql',
    )
    .forRoutes('*');
  }
}
