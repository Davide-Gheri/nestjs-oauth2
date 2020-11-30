import { useQuery } from '@apollo/client';
import { GetUsersDocument, GetUsersQuery, GetUsersQueryVariables } from '../generated/graphql';
import { useEffect, useState } from 'react';

export const useUsers = (limit: number = 10, skip: number = 0) => {
  const { data, loading, error } = useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, {
    variables: {
      limit, skip,
    },
  });
  const [errorCode, setErrorCode] = useState<string>('');

  useEffect(() => {
    if (error && error.graphQLErrors && error.graphQLErrors.length) {
      const firstError = error.graphQLErrors[0];
      if (firstError.extensions && firstError.extensions.code) {
        setErrorCode(firstError.extensions.code);
      }
    }
  }, [error]);

  return {
    users: (data?.getUsers.items || []),
    total: data?.getUsers.paginationInfo.total || 0,
    loading,
    error,
    errorCode,
  }
}
