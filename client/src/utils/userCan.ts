import { dummyGrants, dummyUser } from './dummy';

export type Perms = 'create:any' | 'update:any' | 'delete:any' | 'read:any';

export const userCan = (resource: string, perm: Perms, user?: { role: string }) => {
  if (!user) {
    if (process.env.NODE_ENV === 'development') {
      user = dummyUser;
    } else {
      user = window.__APP_DATA__.user;
    }
  }
  if (!user) {
    return false;
  }
  let grant;
  if (process.env.NODE_ENV === 'development') {
    grant = dummyGrants;
  } else {
    grant = window.__APP_DATA__.grants;
  }
  const userGrants = grant[user.role];
  if (!userGrants || !userGrants[resource]) {
    return false;
  }
  const res = userGrants[resource];
  return !!(res[perm]?.length);
}
