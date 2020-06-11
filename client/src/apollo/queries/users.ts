import { gql } from '@apollo/client';

gql`
  query GetUsers {
      getUsers {
          ...UserData
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
