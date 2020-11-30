/* eslint-disable */
import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
export type Maybe<T> = T | null;

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: any;
};


export type OAuthClient = {
  __typename?: 'OAuthClient';
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  secret: Scalars['String'];
  redirect: Array<Scalars['String']>;
  meta: Scalars['JSON'];
  grantTypes: Array<GrantTypes>;
  responseTypes: Array<ResponseTypes>;
  responseModes: Array<ResponseModes>;
  scopes: Array<Scalars['String']>;
  firstParty: Scalars['Boolean'];
  authMethods: Array<TokenAuthMethod>;
};



export enum GrantTypes {
  Password = 'password',
  AuthorizationCode = 'authorization_code',
  RefreshToken = 'refresh_token',
  ClientCredentials = 'client_credentials'
}

export enum ResponseTypes {
  Code = 'code'
}

export enum ResponseModes {
  Query = 'query',
  Fragment = 'fragment',
  FormPost = 'form_post'
}

export enum TokenAuthMethod {
  ClientSecretPost = 'client_secret_post',
  ClientSecretBasic = 'client_secret_basic',
  None = 'none'
}

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  nickname: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['EmailAddress']>;
  emailVerifiedAt?: Maybe<Scalars['DateTime']>;
  role: Roles;
  tfaEnabled: Scalars['Boolean'];
  picture: Scalars['String'];
};


export enum Roles {
  Admin = 'ADMIN',
  User = 'USER'
}

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  hasMore: Scalars['Boolean'];
  total: Scalars['Int'];
};

export type UsersPaginatedResponse = {
  __typename?: 'UsersPaginatedResponse';
  items: Array<User>;
  paginationInfo: PaginationInfo;
};

export type Session = {
  __typename?: 'Session';
  sessionId: Scalars['ID'];
  ip: Scalars['String'];
  userAgent?: Maybe<Scalars['String']>;
  os?: Maybe<Scalars['String']>;
  browser?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
};

export type Query = {
  __typename?: 'Query';
  activeSessions: Array<Session>;
  clientsCount: Scalars['Int'];
  getClient: OAuthClient;
  getClients: Array<OAuthClient>;
  getCurrentUser?: Maybe<User>;
  getUser: User;
  getUsers: UsersPaginatedResponse;
  newSignUps: Scalars['Int'];
  usersCount: Scalars['Int'];
};


export type QueryGetClientArgs = {
  id: Scalars['ID'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryGetUsersArgs = {
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};


export type QueryNewSignUpsArgs = {
  since: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createClient: OAuthClient;
  updateClient: OAuthClient;
  deleteClient: Scalars['Boolean'];
  createUser: User;
  updateUser: User;
  deleteUser: Scalars['Boolean'];
  deleteSession: Scalars['Boolean'];
  updateCurrentUser: User;
  requestTfa: Scalars['String'];
  verifyTfa: Scalars['Boolean'];
  disableTfa: Scalars['Boolean'];
};


export type MutationCreateClientArgs = {
  data: CreateClientInput;
};


export type MutationUpdateClientArgs = {
  data: UpdateClientInput;
  id: Scalars['ID'];
};


export type MutationDeleteClientArgs = {
  id: Scalars['ID'];
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
  id: Scalars['ID'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSessionArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateCurrentUserArgs = {
  data: UpdateCurrentUserInput;
};


export type MutationVerifyTfaArgs = {
  code: Scalars['String'];
};

export type CreateClientInput = {
  name: Scalars['String'];
  meta?: Maybe<ClientMetaInput>;
  redirect: Array<Scalars['String']>;
  firstParty?: Maybe<Scalars['Boolean']>;
};

export type ClientMetaInput = {
  description?: Maybe<Scalars['String']>;
  logo_uri?: Maybe<Scalars['String']>;
};

export type UpdateClientInput = {
  name?: Maybe<Scalars['String']>;
  meta?: Maybe<ClientMetaInput>;
  redirect?: Maybe<Array<Scalars['String']>>;
  grantTypes?: Maybe<Array<Scalars['String']>>;
  responseTypes?: Maybe<Array<Scalars['String']>>;
  responseModes?: Maybe<Array<Scalars['String']>>;
  authMethods?: Maybe<Array<Scalars['String']>>;
  firstParty?: Maybe<Scalars['Boolean']>;
  scopes?: Maybe<Array<Scalars['String']>>;
};

export type CreateUserInput = {
  nickname: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email: Scalars['EmailAddress'];
  password: Scalars['String'];
  passwordConfirm: Scalars['String'];
  role?: Maybe<Roles>;
};

export type UpdateUserInput = {
  nickname?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['EmailAddress']>;
  role?: Maybe<Roles>;
};

export type UpdateCurrentUserInput = {
  nickname?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['EmailAddress']>;
  password?: Maybe<Scalars['String']>;
  passwordConfirm?: Maybe<Scalars['String']>;
  currentPassword?: Maybe<Scalars['String']>;
};

export type ClientDataFragment = (
  { __typename?: 'OAuthClient' }
  & Pick<OAuthClient, 'id' | 'name' | 'secret' | 'redirect' | 'meta' | 'createdAt' | 'updatedAt' | 'grantTypes' | 'authMethods' | 'responseModes' | 'responseTypes' | 'scopes' | 'firstParty'>
);

export type UserDataFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'nickname' | 'firstName' | 'lastName' | 'email' | 'picture' | 'createdAt' | 'updatedAt' | 'emailVerifiedAt' | 'role' | 'tfaEnabled'>
);

export type SessionDataFragment = (
  { __typename?: 'Session' }
  & Pick<Session, 'sessionId' | 'ip' | 'browser' | 'os' | 'createdAt' | 'userAgent'>
);

export type CreateClientMutationVariables = {
  data: CreateClientInput;
};


export type CreateClientMutation = (
  { __typename?: 'Mutation' }
  & { createClient: (
    { __typename?: 'OAuthClient' }
    & ClientDataFragment
  ) }
);

export type UpdateClientMutationVariables = {
  id: Scalars['ID'];
  data: UpdateClientInput;
};


export type UpdateClientMutation = (
  { __typename?: 'Mutation' }
  & { updateClient: (
    { __typename?: 'OAuthClient' }
    & ClientDataFragment
  ) }
);

export type DeleteClientMutationVariables = {
  id: Scalars['ID'];
};


export type DeleteClientMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteClient'>
);

export type UpdateCurrentUserMutationVariables = {
  data: UpdateCurrentUserInput;
};


export type UpdateCurrentUserMutation = (
  { __typename?: 'Mutation' }
  & { updateCurrentUser: (
    { __typename?: 'User' }
    & UserDataFragment
  ) }
);

export type DeleteSessionMutationVariables = {
  id: Scalars['ID'];
};


export type DeleteSessionMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteSession'>
);

export type RequestTfaMutationVariables = {};


export type RequestTfaMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'requestTfa'>
);

export type VerifyTfaMutationVariables = {
  code: Scalars['String'];
};


export type VerifyTfaMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'verifyTfa'>
);

export type DisableTfaMutationVariables = {};


export type DisableTfaMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'disableTfa'>
);

export type CreateUserMutationVariables = {
  data: CreateUserInput;
};


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'User' }
    & UserDataFragment
  ) }
);

export type UpdateUserMutationVariables = {
  id: Scalars['ID'];
  data: UpdateUserInput;
};


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename?: 'User' }
    & UserDataFragment
  ) }
);

export type DeleteUserMutationVariables = {
  id: Scalars['ID'];
};


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteUser'>
);

export type GetClientsQueryVariables = {};


export type GetClientsQuery = (
  { __typename?: 'Query' }
  & { getClients: Array<(
    { __typename?: 'OAuthClient' }
    & ClientDataFragment
  )> }
);

export type GetClientQueryVariables = {
  id: Scalars['ID'];
};


export type GetClientQuery = (
  { __typename?: 'Query' }
  & { getClient: (
    { __typename?: 'OAuthClient' }
    & ClientDataFragment
  ) }
);

export type GetCurrentUserQueryVariables = {};


export type GetCurrentUserQuery = (
  { __typename?: 'Query' }
  & { getCurrentUser?: Maybe<(
    { __typename?: 'User' }
    & UserDataFragment
  )> }
);

export type GetActiveSessionsQueryVariables = {};


export type GetActiveSessionsQuery = (
  { __typename?: 'Query' }
  & { activeSessions: Array<(
    { __typename?: 'Session' }
    & SessionDataFragment
  )> }
);

export type GetDashboardInfoQueryVariables = {
  since: Scalars['DateTime'];
};


export type GetDashboardInfoQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'clientsCount' | 'usersCount' | 'newSignUps'>
  & { getUsers: (
    { __typename?: 'UsersPaginatedResponse' }
    & { items: Array<(
      { __typename?: 'User' }
      & UserDataFragment
    )> }
  ) }
);

export type GetUsersQueryVariables = {
  skip: Scalars['Int'];
  limit: Scalars['Int'];
};


export type GetUsersQuery = (
  { __typename?: 'Query' }
  & { getUsers: (
    { __typename?: 'UsersPaginatedResponse' }
    & { items: Array<(
      { __typename?: 'User' }
      & UserDataFragment
    )>, paginationInfo: (
      { __typename?: 'PaginationInfo' }
      & Pick<PaginationInfo, 'total' | 'hasMore'>
    ) }
  ) }
);

export type GetUserQueryVariables = {
  id: Scalars['ID'];
};


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { getUser: (
    { __typename?: 'User' }
    & UserDataFragment
  ) }
);

export const ClientDataFragmentDoc = gql`
    fragment ClientData on OAuthClient {
  id
  name
  secret
  redirect
  meta
  createdAt
  updatedAt
  grantTypes
  authMethods
  responseModes
  responseTypes
  scopes
  firstParty
}
    `;
export const UserDataFragmentDoc = gql`
    fragment UserData on User {
  id
  nickname
  firstName
  lastName
  email
  picture
  createdAt
  updatedAt
  emailVerifiedAt
  role
  tfaEnabled
}
    `;
export const SessionDataFragmentDoc = gql`
    fragment SessionData on Session {
  sessionId
  ip
  browser
  os
  createdAt
  userAgent
}
    `;
export const CreateClientDocument = gql`
    mutation CreateClient($data: CreateClientInput!) {
  createClient(data: $data) {
    ...ClientData
  }
}
    ${ClientDataFragmentDoc}`;
export type CreateClientMutationResult = ApolloReactCommon.MutationResult<CreateClientMutation>;
export type CreateClientMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateClientMutation, CreateClientMutationVariables>;
export const UpdateClientDocument = gql`
    mutation UpdateClient($id: ID!, $data: UpdateClientInput!) {
  updateClient(id: $id, data: $data) {
    ...ClientData
  }
}
    ${ClientDataFragmentDoc}`;
export type UpdateClientMutationResult = ApolloReactCommon.MutationResult<UpdateClientMutation>;
export type UpdateClientMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateClientMutation, UpdateClientMutationVariables>;
export const DeleteClientDocument = gql`
    mutation DeleteClient($id: ID!) {
  deleteClient(id: $id)
}
    `;
export type DeleteClientMutationResult = ApolloReactCommon.MutationResult<DeleteClientMutation>;
export type DeleteClientMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteClientMutation, DeleteClientMutationVariables>;
export const UpdateCurrentUserDocument = gql`
    mutation UpdateCurrentUser($data: UpdateCurrentUserInput!) {
  updateCurrentUser(data: $data) {
    ...UserData
  }
}
    ${UserDataFragmentDoc}`;
export type UpdateCurrentUserMutationResult = ApolloReactCommon.MutationResult<UpdateCurrentUserMutation>;
export type UpdateCurrentUserMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateCurrentUserMutation, UpdateCurrentUserMutationVariables>;
export const DeleteSessionDocument = gql`
    mutation DeleteSession($id: ID!) {
  deleteSession(id: $id)
}
    `;
export type DeleteSessionMutationResult = ApolloReactCommon.MutationResult<DeleteSessionMutation>;
export type DeleteSessionMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteSessionMutation, DeleteSessionMutationVariables>;
export const RequestTfaDocument = gql`
    mutation RequestTfa {
  requestTfa
}
    `;
export type RequestTfaMutationResult = ApolloReactCommon.MutationResult<RequestTfaMutation>;
export type RequestTfaMutationOptions = ApolloReactCommon.BaseMutationOptions<RequestTfaMutation, RequestTfaMutationVariables>;
export const VerifyTfaDocument = gql`
    mutation VerifyTfa($code: String!) {
  verifyTfa(code: $code)
}
    `;
export type VerifyTfaMutationResult = ApolloReactCommon.MutationResult<VerifyTfaMutation>;
export type VerifyTfaMutationOptions = ApolloReactCommon.BaseMutationOptions<VerifyTfaMutation, VerifyTfaMutationVariables>;
export const DisableTfaDocument = gql`
    mutation DisableTfa {
  disableTfa
}
    `;
export type DisableTfaMutationResult = ApolloReactCommon.MutationResult<DisableTfaMutation>;
export type DisableTfaMutationOptions = ApolloReactCommon.BaseMutationOptions<DisableTfaMutation, DisableTfaMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($data: CreateUserInput!) {
  createUser(data: $data) {
    ...UserData
  }
}
    ${UserDataFragmentDoc}`;
export type CreateUserMutationResult = ApolloReactCommon.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: ID!, $data: UpdateUserInput!) {
  updateUser(id: $id, data: $data) {
    ...UserData
  }
}
    ${UserDataFragmentDoc}`;
export type UpdateUserMutationResult = ApolloReactCommon.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
    `;
export type DeleteUserMutationResult = ApolloReactCommon.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const GetClientsDocument = gql`
    query GetClients {
  getClients {
    ...ClientData
  }
}
    ${ClientDataFragmentDoc}`;
export type GetClientsQueryResult = ApolloReactCommon.QueryResult<GetClientsQuery, GetClientsQueryVariables>;
export const GetClientDocument = gql`
    query GetClient($id: ID!) {
  getClient(id: $id) {
    ...ClientData
  }
}
    ${ClientDataFragmentDoc}`;
export type GetClientQueryResult = ApolloReactCommon.QueryResult<GetClientQuery, GetClientQueryVariables>;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  getCurrentUser {
    ...UserData
  }
}
    ${UserDataFragmentDoc}`;
export type GetCurrentUserQueryResult = ApolloReactCommon.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetActiveSessionsDocument = gql`
    query GetActiveSessions {
  activeSessions {
    ...SessionData
  }
}
    ${SessionDataFragmentDoc}`;
export type GetActiveSessionsQueryResult = ApolloReactCommon.QueryResult<GetActiveSessionsQuery, GetActiveSessionsQueryVariables>;
export const GetDashboardInfoDocument = gql`
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
    ${UserDataFragmentDoc}`;
export type GetDashboardInfoQueryResult = ApolloReactCommon.QueryResult<GetDashboardInfoQuery, GetDashboardInfoQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers($skip: Int!, $limit: Int!) {
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
    ${UserDataFragmentDoc}`;
export type GetUsersQueryResult = ApolloReactCommon.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($id: ID!) {
  getUser(id: $id) {
    ...UserData
  }
}
    ${UserDataFragmentDoc}`;
export type GetUserQueryResult = ApolloReactCommon.QueryResult<GetUserQuery, GetUserQueryVariables>;

      export interface IntrospectionResultData {
        __schema: {
          types: {
            kind: string;
            name: string;
            possibleTypes: {
              name: string;
            }[];
          }[];
        };
      }
      const result: IntrospectionResultData = {
  "__schema": {
    "types": []
  }
};
      export default result;
    