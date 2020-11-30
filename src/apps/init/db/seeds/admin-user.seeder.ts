import { Seeder } from '@init/db/seeder.interface';
import { EntityManager } from 'typeorm';
import { User } from '@app/entities';
import { Roles } from '@app/modules/auth';


export class AdminUserSeeder implements Seeder {
  async run(em: EntityManager): Promise<any> {
    await em.getRepository(User).save(
      em.getRepository(User).create({
        nickname: 'Admin',
        email: 'admin@admin.com',
        password: 'admin',
        role: Roles.ADMIN,
      }),
    );
  }

  async revert(em: EntityManager): Promise<any> {
  }
}
