import { gql } from '@apollo/client';

gql`
  mutation UpdateCurrentUser($data: UpdateCurrentUserInput!) {
      updateCurrentUser(data: $data) {
          ...UserData
      }
  }
`;

gql`
  mutation DeleteSession($id: ID!) {
      deleteSession(id: $id)
  }
`;
