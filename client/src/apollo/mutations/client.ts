import { gql } from '@apollo/client';

gql`
  mutation CreateClient($data: CreateClientInput!) {
      createClient(data: $data) {
          ...ClientData
      }
  }
`;

gql`
  mutation UpdateClient($id: ID!, $data: UpdateClientInput!) {
      updateClient(id: $id, data: $data) {
          ...ClientData
      }
  }
`;

gql`
  mutation DeleteClient($id: ID!) {
      deleteClient(id: $id)
  }
`;
