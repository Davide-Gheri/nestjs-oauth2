import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { PasswordServiceGrant } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/entities';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    PasswordServiceGrant,
  ],
  exports: [
    PasswordServiceGrant,
  ],
})
export class PasswordModule {}
