import { useQuery } from '@apollo/client';
import { GetUserDocument, GetUserQuery, GetUserQueryVariables } from '../generated/graphql';

export const useUser = (id: string) => {
  const { data, loading, error } = useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, {
    variables: { id },
    skip: !id,
  });

  return {
    user: data?.getUser,
    loading,
    error,
  };
}
