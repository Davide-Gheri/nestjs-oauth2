import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { RefreshTokenServiceGrant } from './services';

@Module({
  imports: [
    CommonModule,
  ],
  providers: [
    RefreshTokenServiceGrant,
  ],
  exports: [
    RefreshTokenServiceGrant,
  ],
})
export class RefreshTokenModule {}
