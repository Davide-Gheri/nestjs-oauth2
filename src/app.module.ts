import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as configs from './config';
import * as entities from './entities';
import { RedisModule } from '@app/lib/redis';
import { AuthModule } from './modules/auth';
import { OAuth2Module } from './modules/oauth2/oauth2.module';
import { OpenIdModule } from './modules/openid/open-id.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Object.values(configs),
    }),
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
    AuthModule,
    OAuth2Module,
    OpenIdModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
