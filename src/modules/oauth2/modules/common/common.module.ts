import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthAccessToken, OAuthClient, OAuthCode, OAuthRefreshToken } from '@app/entities';
import { AccessTokenService, ClientService, RefreshTokenService } from './services';
import { CipherModule } from '@app/lib/cipher';
import { JwtModule } from '@app/lib/jwt';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      OAuthCode, OAuthClient, OAuthAccessToken, OAuthRefreshToken,
    ]),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => config.get('jwt'),
    // }),
    CipherModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('crypto'),
    }),
    JwtModule,
  ],
  providers: [
    ClientService,
    AccessTokenService,
    RefreshTokenService,
  ],
  exports: [
    ConfigModule,
    JwtModule,
    CipherModule,
    ClientService,
    AccessTokenService,
    RefreshTokenService,
  ],
})
export class CommonModule {}
