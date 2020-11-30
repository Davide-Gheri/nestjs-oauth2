import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthAccessToken, OAuthClient, OAuthCode, OAuthRefreshToken } from '@app/entities';
import { AccessTokenService, ClientService, RefreshTokenService } from './services';
import { CipherModule } from '@app/lib/cipher';
import { JwtModule } from '@app/lib/jwt';
import { AesStrategy, JwtStrategy, TOKEN_STRATEGY } from './token';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      OAuthCode, OAuthClient, OAuthAccessToken, OAuthRefreshToken,
    ]),
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
    JwtStrategy,
    AesStrategy,
    {
      provide: TOKEN_STRATEGY,
      inject: [ConfigService, JwtStrategy, AesStrategy],
      useFactory: (config: ConfigService, jwt: JwtStrategy, aes: AesStrategy) => {
        const strategy = config.get('oauth.accessTokenType');
        switch (strategy) {
          case 'jwt':
            return jwt;
          case 'aes':
            return aes;
          default:
            throw new RuntimeException(`Unknown token type ${strategy}`);
        }
      },
    },
  ],
  exports: [
    ConfigModule,
    JwtModule,
    CipherModule,
    ClientService,
    AccessTokenService,
    RefreshTokenService,
    TOKEN_STRATEGY,
  ],
})
export class CommonModule {}
