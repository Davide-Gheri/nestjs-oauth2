import { gql } from '@apollo/client';

gql`
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

gql`
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

gql`
    fragment SessionData on Session {
        sessionId
        ip
        browser
        os
        createdAt
        userAgent
    }
`;
