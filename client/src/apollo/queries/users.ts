import { gql } from '@apollo/client';

gql`
  query GetUsers(
      $skip: Int!
      $limit: Int!
  ) {
      getUsers(skip: $skip, limit: $limit) {
          items {
              ...UserData
          }
          paginationInfo {
              total
              hasMore
          }
      }
  }
`;

gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
        ...UserData
    }
  }
`;
