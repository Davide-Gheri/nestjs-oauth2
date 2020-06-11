import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import { typeDefs } from './typeDefs';
import {
  GetActiveSessionsDocument,
  GetActiveSessionsQuery,
  GetCurrentUserDocument,
  GetCurrentUserQuery,
  UserDataFragment,
} from '../generated/graphql';
import { dummySessions } from '../utils/dummy';

const XSRFToken = document.head.querySelector('meta[name="csrf-token"]');

if (!XSRFToken) {
  console.error('CSRF token not found');
}

export const createApolloClient = (user: UserDataFragment) => {
  const cache = new InMemoryCache();

  const authLink = setContext(
    async (_, { headers }) => {
      return {
        headers: {
          'X-CSRF-TOKEN': XSRFToken!.getAttribute('content')!,
          ...headers,
        },
      };
    },
  );

  const httpLink = new HttpLink({
    uri: '/api/graphql',
    credentials: 'same-origin',
    includeExtensions: true,
  });

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([
      authLink,
      httpLink,
    ]),
    cache,
    typeDefs,
  });

  apolloClient.writeQuery<GetCurrentUserQuery>({
    query: GetCurrentUserDocument,
    data: {
      getCurrentUser: {
        ...user,
        __typename: 'User',
      },
    },
  });

  if (process.env.NODE_ENV === 'development') {
    apolloClient.writeQuery<GetActiveSessionsQuery>({
      query: GetActiveSessionsDocument,
      data: {
        activeSessions: dummySessions.map(s => ({
          ...s,
          __typename: 'Session',
        })),
      },
    });
  }

  return apolloClient;
}
