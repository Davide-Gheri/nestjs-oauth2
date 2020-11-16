import { useQuery } from '@apollo/client';
import { GetClientDocument, GetClientQuery, GetClientQueryVariables } from '../generated/graphql';

export const useClient = (id: string) => {
  const { data, error, loading } = useQuery<GetClientQuery, GetClientQueryVariables>(GetClientDocument, {
    variables: { id },
    skip: !id,
  });

  return {
    client: data?.getClient,
    loading,
    error,
  };
}
