import { useQuery } from '@apollo/client';
import { GetCurrentUserDocument, GetCurrentUserQuery } from '../generated/graphql';

export const useAppCurrentUser = () => {
  const { data } = useQuery<GetCurrentUserQuery>(GetCurrentUserDocument, {
    fetchPolicy: 'cache-only',
  });
  return data?.getCurrentUser;
}
