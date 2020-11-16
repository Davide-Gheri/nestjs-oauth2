---
id: userinfo
title: User info
---

The OAuth2 server expose an endpoint to get information about the user associated with the access token.
The return payload depends on the `openid` scopes applied.

**Endpoint**: `/userinfo`

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
  "sub": "deb3422d-f5cb-4c50-bb2d-ba92477a1201",
  "email": "mail@demo.com",
  "name": "Demo",
  "picture": "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
  "updated_at": "2020-01-22 10:10:10"
}
```

### Payload description

| Name       | Required scope | Description              |
|------------|----------------|--------------------------|
| sub        | openid         | User unique identifier   |
| email      | email          | User email               |
| name       | profile        | Username                 |
| picture    | profile        | User profile picture url |
| updated_at | profile        | User last update date    |

