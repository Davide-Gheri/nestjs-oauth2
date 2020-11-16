---
id: client_credentials
title: Client credentials grant
---

The Client credentials grant is mostly used for server to server connections and is not bound to a user. it is used to retrieve some information about the Client itself (name, logo, descriptions ecc.)

**Endpoint**: `/oauth2/token`

**Method**: `POST`

## Request payload

```json
{
  "client_id": "c02d5bf5-993e-4c6a-a248-6c307cc7681b",
  "client_secret": "c5bb2489292fac7711baedd65d87296261d08cdbdde2073c9fdb29941ac5446a",
  "grant_type": "client_credentials",
  "scope": "read:something list:something"
}
```

### Payload description

| Name          | Required | Default | Description                                      |
|---------------|----------|---------|--------------------------------------------------|
| grant_type    | true     | null    | Must be set as `client_credentials`              |
| client_id     | true     | null    | Client id that is requesting access              |
| client_secret | true     | null    | Client secret that is requesting access          |
| scope         | false    | null    | Optional space separated list of scopes to apply |

## Response payload
```json
{
  "access_token": "JWT TOKEN"
}
```
