import { useQuery } from '@apollo/client';
import { GetUsersDocument, GetUsersQuery } from '../generated/graphql';
import { useEffect, useState } from 'react';

export const useUsers = () => {
  const { data, loading, error } = useQuery<GetUsersQuery>(GetUsersDocument);

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
    users: (data?.getUsers || []),
    loading,
    error,
    errorCode,
  }
}
