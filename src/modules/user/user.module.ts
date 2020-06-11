import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegisterService, UserService } from '@app/modules/user/services';
import { MailModule } from '@app/modules/mail';
import { TestController } from '@app/modules/user/test.controller';
import { SignModule } from '@app/lib/sign';
import { EmailController, UserController } from '@app/modules/user/controllers';
import { CipherModule } from '@app/lib/cipher';
import { PasswordService } from '@app/modules/user/services/password.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    MailModule,
    SignModule.register({
      secret: 'secret',
      ttl: 60 * 60 * 24,
    }),
    CipherModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('crypto'),
    }),
  ],
  providers: [
    UserService,
    RegisterService,
    PasswordService,
  ],
  controllers: [
    TestController,
    EmailController,
    UserController,
  ],
  exports: [
    UserService,
    RegisterService,
  ],
})
export class UserModule {}
