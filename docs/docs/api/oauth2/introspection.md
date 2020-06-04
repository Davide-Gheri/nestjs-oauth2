---
id: introspection
title: Introspection
---

The OAuth2 server expose an endpoint to get information about an access_token

**Endpoint**: `/oauth2/introspect`

***Method***: `GET`

## Request Headers
```json
{
  "Authorization": "Bearer ACCESS_TOKEN"
}
```

## Response payload
```json
{
  "active": true,
  "exp": 1589795077,
  "client_id": "c02d5bf5-993e-4c6a-a248-6c307cc7681b",
  "scope": "openid email profile page:read",
  "username": "test@mail.com",
  "sub": "deb3422d-f5cb-4c50-bb2d-ba92477a1201"
}
```

### Payload description

| Name      | Always | type    | Description                                                         |
|-----------|--------|---------|---------------------------------------------------------------------|
| active    | true   | boolean | Check if the access_token is valid (not expired, exists, not revoked)                    |
| exp       | true   | number  | Return the token expiration date                                    |
| client_id | true   | string  | The Client id associated with the access_token                      |
| scope     | true   | string  | space separated scopes associated with this access_token            |
| username  | false  | string  | if found, return a human readable identifier of the associated user |
| sub       | false  | string  | associated user id                                                  |
