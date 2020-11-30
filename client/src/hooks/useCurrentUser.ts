import { useAppData } from './useAppdata';

export const useCurrentUser = () => {
  const { user } = useAppData();

  return user;
}
