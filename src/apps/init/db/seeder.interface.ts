import { EntityManager } from 'typeorm';

export interface Seeder {
  run(em: EntityManager): Promise<any>;
  revert(em: EntityManager): Promise<any>;
  shouldSeed?(em: EntityManager): Promise<boolean>;
}
