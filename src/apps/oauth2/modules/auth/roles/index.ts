import { RolesBuilder } from 'nest-access-control';

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const roles: RolesBuilder = new RolesBuilder();

roles.grant(Roles.USER)
// User roles
  .grant(Roles.ADMIN)
  .createAny('client')
  .updateAny('client')
  .deleteAny('client')
  .readAny('client')

  .createAny('user')
  .updateAny('user')
  .deleteAny('user')
  .readAny('user');
