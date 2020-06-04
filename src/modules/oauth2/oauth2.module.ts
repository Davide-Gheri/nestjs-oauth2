import { Module } from '@nestjs/common';
import { CodeService, TokenService } from './services';
import { AuthorizeController, TokenController } from './controllers';
import {
  CommonModule,
  ClientCredentialsModule,
  PasswordModule,
  RefreshTokenModule,
  AuthorizationCodeModule,
} from './modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthAccessToken, OAuthClient, OAuthRefreshToken } from '@app/entities';
import { DebugController } from '@app/modules/oauth2/controllers/debug.controller';

@Module({
  imports: [
    CommonModule,
    ClientCredentialsModule,
    PasswordModule,
    RefreshTokenModule,
    AuthorizationCodeModule,
    TypeOrmModule.forFeature([
      OAuthAccessToken,
      OAuthRefreshToken,
      OAuthClient,
    ]),
  ],
  providers: [
    TokenService,
    CodeService,
  ],
  controllers: [
    TokenController,
    AuthorizeController,
    DebugController,
  ],
})
export class OAuth2Module {}
