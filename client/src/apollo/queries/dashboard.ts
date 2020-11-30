import { gql } from '@apollo/client';

gql`
  query GetDashboardInfo($since: DateTime!) {
      clientsCount
      usersCount
      newSignUps(since: $since)
      getUsers(limit: 5) {
          items {
              ...UserData
          }
      }
  }
`;
