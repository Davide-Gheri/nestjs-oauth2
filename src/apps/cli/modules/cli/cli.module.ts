import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as configs from '@config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from '@app/entities';
import { ConsoleModule } from 'nestjs-console';
import { KeysService } from './services';
import { CipherModule } from '@app/lib/cipher';

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
    CipherModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('crypto'),
    }),
    TypeOrmModule.forFeature(Object.values(entities)),
    ConsoleModule,
  ],
  providers: [
    KeysService,
  ],
})
export class CliModule {}
