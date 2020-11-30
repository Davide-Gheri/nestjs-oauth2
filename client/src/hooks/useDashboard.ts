import { useQuery } from '@apollo/client';
import { GetDashboardInfoDocument, GetDashboardInfoQuery, GetDashboardInfoQueryVariables } from '../generated/graphql';
import { useEffect, useState } from 'react';

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

export const useDashboard = () => {
  const { data, loading, error } = useQuery<GetDashboardInfoQuery, GetDashboardInfoQueryVariables>(GetDashboardInfoDocument, {
    variables: {
      since: sevenDaysAgo,
    },
    fetchPolicy: 'network-only',
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
    counts: {
      users: data?.usersCount,
      clients: data?.clientsCount,
      signUps: data?.newSignUps,
    },
    lastUsers: data?.getUsers.items || [],
    loading,
    error,
    errorCode,
  }
}
