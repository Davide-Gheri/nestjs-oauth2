import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@app/modules/auth';
import { UserModule } from '@app/modules/user';
import { UserApiController } from '@app/modules/user-api/controllers';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    UserModule,
  ],
  controllers: [
    UserApiController,
  ],
})
export class UserApiModule {}
