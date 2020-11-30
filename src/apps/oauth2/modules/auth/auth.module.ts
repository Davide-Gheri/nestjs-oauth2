import { forwardRef, HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthClient, User } from '@app/entities';
import { SessionSerializer } from './serializers';
import { PassportModule } from '@nestjs/passport';
import { LoginController, LogoutController, RegisterController, SocialController } from './controllers';
import { AuthenticatedGuard, GuestGuard, JwtGuard, LoginGuard, ScopeGuard, TfaGuard } from './guards';
import { GuestExceptionFilter } from './filters';
import { APP_FILTER } from '@nestjs/core';
import { FacebookStrategy, GoogleStrategy, JwtStrategy, LocalStrategy, TfaStrategy } from './strategies';
import { JwtModule } from '@app/lib/jwt';
import { UserModule } from '@app/modules/user';
import { TfaExceptionFilter } from '@app/modules/auth/filters/tfa-exception.filter';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([User, OAuthClient]),
    PassportModule.register({
      session: true,
      defaultStrategy: 'local',
    }),
    JwtModule,
    forwardRef(() => UserModule),
  ],
  providers: [
    SessionSerializer,
    LocalStrategy,
    JwtStrategy,
    TfaStrategy,
    FacebookStrategy,
    GoogleStrategy,
    LoginGuard,
    AuthenticatedGuard,
    GuestGuard,
    JwtGuard,
    TfaGuard,
    ScopeGuard,
    {
      provide: APP_FILTER,
      useClass: GuestExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TfaExceptionFilter,
    },
  ],
  controllers: [
    RegisterController,
    LoginController,
    LogoutController,
    SocialController,
  ],
  exports: [
    GuestGuard,
    LoginGuard,
    AuthenticatedGuard,
    ScopeGuard,
  ]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
  }
}
