import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CipherModule } from '@app/lib/cipher';
import { JwtService } from '@app/lib/jwt/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Key } from '@app/entities';

@Module({
  imports: [
    ConfigModule,
    CipherModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('crypto'),
    }),
    TypeOrmModule.forFeature([Key]),
  ],
  providers: [
    JwtService,
  ],
  exports: [
    JwtService,
  ],
})
export class JwtModule {}
