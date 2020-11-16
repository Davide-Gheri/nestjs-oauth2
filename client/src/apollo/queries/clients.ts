import { gql } from '@apollo/client';

gql`
  query GetClients {
      getClients {
          ...ClientData
      }
  }
`;

gql`
  query GetClient($id: ID!) {
      getClient(id: $id) {
          ...ClientData
      }
  }
`;
