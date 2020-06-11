import { gql } from '@apollo/client';

gql`
  query GetCurrentUser {
      getCurrentUser {
          ...UserData
      }
  }
`;


gql`
  query GetActiveSessions {
      activeSessions {
          ...SessionData
      }
  }
`;
