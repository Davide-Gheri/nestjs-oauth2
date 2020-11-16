import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { AuthCodeService, AuthorizationCodeServiceGrant } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthCode } from '@app/entities';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([
      OAuthCode,
    ]),
  ],
  providers: [
    AuthCodeService,
    AuthorizationCodeServiceGrant,
  ],
  exports: [
    AuthCodeService,
    AuthorizationCodeServiceGrant,
  ],
})
export class AuthorizationCodeModule {}
