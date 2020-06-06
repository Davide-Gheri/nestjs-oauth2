import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HandlebarsAdapter } from './handlebars.adapter';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [
    HandlebarsAdapter,
  ],
  exports: [
    HandlebarsAdapter,
  ],
})
export class AdapterModule {}
