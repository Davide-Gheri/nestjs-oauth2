import { gql } from '@apollo/client';

export const typeDefs = gql`
  directive @client on FIELD
  extend type Query {
      getCurrentUser: User
  }
`;
