import { dummyUser } from '../utils/dummy';

export const useCurrentUser = () => {
  let user: any;

  if (process.env.NODE_ENV === 'development') {
    user = dummyUser;
  } else {
    user = window.__APP_DATA__.user;
  }

  return user;
}
