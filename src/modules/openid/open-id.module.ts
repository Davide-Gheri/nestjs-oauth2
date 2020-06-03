import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenIdService } from './services';
import { UserInfoController, WellKnownController } from './controllers';
import { JwtModule } from '@app/lib/jwt';
import { AuthModule } from '@app/modules/auth';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    JwtModule,
  ],
  providers: [
    OpenIdService,
  ],
  controllers: [
    WellKnownController,
    UserInfoController,
  ],
})
export class OpenIdModule {}
