import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/entities';
import { SessionSerializer } from './serializers';
import { PassportModule } from '@nestjs/passport';
import csurf from 'csurf';
import { LoginController, LogoutController, RegisterController } from './controllers';
import { AuthService, RegisterService } from './services';
import { AuthenticatedGuard, GuestGuard, JwtGuard, LoginGuard } from './guards';
import { GuestExceptionFilter } from './filters';
import { APP_FILTER } from '@nestjs/core';
import { JwtStrategy, LocalStrategy } from './strategies';
import { JwtModule } from '@app/lib/jwt';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      session: true,
      defaultStrategy: 'local',
    }),
    JwtModule,
  ],
  providers: [
    SessionSerializer,
    LocalStrategy,
    JwtStrategy,
    RegisterService,
    AuthService,
    LoginGuard,
    AuthenticatedGuard,
    GuestGuard,
    JwtGuard,
    {
      provide: APP_FILTER,
      useClass: GuestExceptionFilter,
    },
  ],
  controllers: [
    RegisterController,
    LoginController,
    LogoutController,
  ],
  exports: [
    AuthService,
    RegisterService,
    GuestGuard,
    LoginGuard,
    AuthenticatedGuard,
  ]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(csurf({ cookie: true }))
      .exclude(
        'oauth2/(.*)',
        'debug/(.*)',
      )
      .forRoutes('*');
  }
}
