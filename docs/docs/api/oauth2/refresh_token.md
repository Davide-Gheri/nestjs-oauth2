---
id: refresh_token
title: Refresh token grant
---

The Refresh token grant is used to issue a new access_token without reimplementing all the authorization flow.

The access_token is short lived (few minutes, 1 hour), to avoid a horrible user experience (asking the user to log in every 1 hour), a refresh_token can be issued.

The refresh token is long lived (months, years) and enable the user to stay logged in for a long time.

Each refresh token is bound to an access token and cannot be used more the once. When a new access token is issued with the refresh_token grant, a new associated refresh token is issued. The refresh token lifetime is not reset, meaning that if the first refresh_token expiration is in 365d and a new refresh token is issued after 1d, the new refresh token expiration will be 364d.
When 365d are passed, the user must login again.  

**Endpoint**: `/oauth2/token`

**Method**: `POST`

## Request payload

```json
{
  "client_id": "c02d5bf5-993e-4c6a-a248-6c307cc7681b",
  "client_secret": "c5bb2489292fac7711baedd65d87296261d08cdbdde2073c9fdb29941ac5446a",
  "grant_type": "refresh_token",
  "refresh_token": "REFRESH TOKEN"
}
```

### Payload description

| Name          | Required | Default | Description                                      |
|---------------|----------|---------|--------------------------------------------------|
| grant_type    | true     | null    | Must be set as `client_credentials`              |
| client_id     | true     | null    | Client id that is requesting access              |
| client_secret | false    | null    | Client secret that is requesting access          |
| refresh_token | true     | null    | The refresh token associated with the current access token |

## Response payload
```json
{
  "access_token": "JWT TOKEN",
  "refresh_token": "NEW REFRESH TOKEN"
}
```
