import { gql } from '@apollo/client';

gql`
  mutation CreateUser($data: CreateUserInput!) {
      createUser(data: $data) {
          ...UserData
      }
  }
`;

gql`
  mutation UpdateUser($id: ID!, $data: UpdateUserInput!) {
      updateUser(id: $id, data: $data) {
          ...UserData
      }
  }
`;

gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
    }
`;
