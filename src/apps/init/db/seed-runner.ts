import { Connection, EntityManager } from 'typeorm';
import { Seeder } from './seeder.interface';
import { Type } from '@nestjs/common';

export class SeedRunner {
  constructor(
    private readonly connection: Connection,
  ) {}

  async runAll(seeders: Type<Seeder>[]) {
    await this.connection.transaction(async em => {
      await Promise.all(
        seeders.map(async seeder => await this.run(seeder, em)),
      );
    });
  }

  async revertAll(seeders: Type<Seeder>[]) {
    await this.connection.transaction(async em => {
      await Promise.all(
        seeders.map(async seeder => await this.revert(seeder, em)),
      );
    });
  }

  async run(seeder: Type<Seeder>, manager?: EntityManager) {
    const instance = new seeder();
    const hasCheck = 'shouldSeed' in instance;
    if (!hasCheck || await instance.shouldSeed(manager)) {
      await instance.run(manager);
    } else {
      await Promise.resolve();
    }
  }

  async revert(seeder: Type<Seeder>, manager?: EntityManager) {
    const instance = new seeder();
    await instance.revert(manager);
  }
}
