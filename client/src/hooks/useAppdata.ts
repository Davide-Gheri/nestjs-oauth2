import { dummyGrants, dummySessions, dummyUser } from '../utils/dummy';

export const useAppData = (): typeof window.__APP_DATA__ => {
  if (process.env.NODE_ENV === 'development') {
    return {
      user: dummyUser,
      currentSession: dummySessions[0].sessionId,
      grants: dummyGrants,
      appName: 'App name',
    } as typeof window.__APP_DATA__;
  }
  return window.__APP_DATA__;
}
