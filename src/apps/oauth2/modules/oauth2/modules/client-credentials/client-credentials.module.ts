import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { ClientCredentialsServiceGrant } from './services';

@Module({
  imports: [
    CommonModule,
  ],
  providers: [
    ClientCredentialsServiceGrant,
  ],
  exports: [
    ClientCredentialsServiceGrant,
  ],
})
export class ClientCredentialsModule {}
