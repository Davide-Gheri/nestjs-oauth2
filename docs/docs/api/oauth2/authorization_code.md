---
id: authorization_code
title: Authorization code grant
---

The Authorization code grant is the most commonly used (think about the "Login with Facebook/Google" buttons). It explicitly asks the user the permission to give access to its data to the client app.

## Authorization flow
To start an authorization flow, the client must redirect the user to the auth server `/oauth2/authorize` endpoint passing the required configuration as query string:

| Name          | Required                 | Default | Description                                       |
|---------------|--------------------------|---------|---------------------------------------------------|
| response_type | true                     | null    | Must be set as `code`                             |
| client_id     | true                     | null    | Client id that is requesting access               |
| state         | true                     | null    | String that can have a meaning for the client     |
| scope         | false                    | null    | Optional comma separated list of scopes to apply  |
| redirect_uri  | true                     | null    | Specify to which redirect url redirect the user   |
| response_type | false                    | code    | Specify what kind of response the client expects  |
| response_mode | false                    | query   | Specify how the client expect the response        |

The Server will authenticate the user and, if the client is not flagged as first party, ask him to explicitly authorize the client application to access its data

If the user authorize it, the server will generate an Authorization Code and redirect the user to the redirect_uri passing `code=GENERATED_AUTH_CODE` as query string

The authorization code can only be used by this client, expires fast, and only to retrieve an access_token (the authorization code does not authenticate the user, but only 'authorize' the client to authenticate on behalf of the user).

The Client then retrieve the token

**Endpoint**: `/oauth2/token`

**Method**: `POST`

## Request payload

```json
{
  "client_id": "c02d5bf5-993e-4c6a-a248-6c307cc7681b",
  "client_secret": "c5bb2489292fac7711baedd65d87296261d08cdbdde2073c9fdb29941ac5446a",
  "code": "code-retrieved-from-querystring",
  "grant_type": "authorization_code",
  "redirect_uri": "exmaple.com/cb",
  "scope": "read:something list:something"
}
```

### Payload description

| Name          | Required | Default | Description                                      |
|---------------|----------|---------|--------------------------------------------------|
| grant_type    | true     | null    | Must be set as `authorization_code`              |
| client_id     | true     | null    | Client id that is requesting access              |
| client_secret | true     | null    | Client secret that is requesting access          |
| code          | true     | null    | Authorization code from querystring              |
| redirect_uri  | true     | null    | Same redirect uri as the /authorize redirect     | 
| scope         | false    | null    | Optional space separated list of scopes to apply, should match the ones used in the /authorize |

## Response payload
```json
{
  "access_token": "JWT TOKEN"
}
```

## PKCE (Proof Key for Code Exchange) extension

If a **Public** client (authMethds: ['none']) is trying to use this grant it MUST implement the PKCE extension.

Before redirecting to authorize endpoint, the client generates a random string and its sha256 hash, persisting the random string in some way (to be used in the callback).

To the `/oauth/authorize` redirect, the client will pass a `code_challenge` param with the base64 url safe of the generated hash and a `code_challenge_method` param with value `SHA-256`

When the client asks for a token using the Authorization code, it will pass a `code_verifier` param with the plain random string generated at the previous step.

The server will generate the sha256 of the passed `code_verifier` and compare its base64 with the `code_challenge` passed before.   
