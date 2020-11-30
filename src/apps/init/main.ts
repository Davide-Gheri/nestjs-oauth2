import { NestFactory } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import * as seeds from './db/seeds';
import { SeedRunner } from './db/seed-runner';
import { InitModule } from './init.module';

export default async function bootstrap() {
  process.env.NODE_LOG = 'debug';

  const app = await NestFactory.createApplicationContext(InitModule);

  const connection = app.get<Connection>(getConnectionToken());

  await connection.runMigrations({ transaction: 'all' });

  const seeder = new SeedRunner(connection);

  await seeder.runAll(Object.values(seeds));

  await connection.close();

  process.exit(0);
}
