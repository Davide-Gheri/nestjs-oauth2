import { useQuery } from '@apollo/client';
import { GetClientsDocument, GetClientsQuery } from '../generated/graphql';
import { useEffect, useState } from 'react';

export const useClients = () => {
  const { data, loading, error } = useQuery<GetClientsQuery>(GetClientsDocument);
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
    clients: (data?.getClients || []),
    loading,
    error,
    errorCode: errorCode,
  };
}
