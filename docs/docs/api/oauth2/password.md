---
id: password
title: Password grant
---

The Password grant is mostly used for first party clients, for example the organization native app would like to show the user a Login View inside the App without the necessity to open a webview to start the Authorization flow 

**Endpoint**: `/oauth2/token`

**Method**: `POST`

## Request payload

```json
{
  "username": "me@mail.com",
  "password": "password",
  "client_id": "c02d5bf5-993e-4c6a-a248-6c307cc7681b",
  "grant_type": "password",
  "scope": "read:something list:something"
}
```

### Payload description

| Name          | Required | Default | Description                                      |
|---------------|----------|---------|--------------------------------------------------|
| username      | true     | null    | user username                                    |
| password      | true     | null    | user password                                    |
| grant_type    | true     | null    | Must be set as `password`                        |
| client_id     | true     | null    | Client id that is requesting access              |
| client_secret | false    | null    | Optional client secret that is requesting access |
| scope         | false    | null    | Optional space separated list of scopes to apply |


## Response payload
```json
{
  "access_token": "JWT TOKEN"
}
```

