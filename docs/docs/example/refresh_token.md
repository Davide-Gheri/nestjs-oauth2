---
id: refresh_token
title: Refresh token
---

## Intro

This example demonstrates how to consume the OAuth2 server using the refresh_token grant in a client side application, assuming the OAuth2 server is responding at `http://oauth.server.com` and the client is responding at `http://client.server.com`

Assuming an authorization flow with scope `offline_access` was already done

### Client data

```js
const client = {
  id: 'c02d5bf5-993e-4c6a-a248-6c307cc7681b',
  secret: 'c5bb2489292fac7711baedd65d87296261d08cdbdde2073c9fdb29941ac5446a',
  redirect: ['http://client.server.com/callback'],
  firstParty: false,
  grantTypes: ['authorization_code', 'refresh_token'],
  responseTypes: ['code'],
  responseModes: ['query'],
  authMethods: ['client_secret_post'],
  scopes: ['openid', 'email', 'profile', 'offline_access'],
}
```

### Authorization response

```js
let authPayload = {
  access_token: 'JWT_TOKEN',
  refresh_token: 'REFRESH_TOKEN',
}
```

### Client implementation

```js
// Make an API call to a client endpoint that uses the access_token to authenticate the user
// but the access_token is expired

fetch('http://client.server.com/api/posts/123', {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${authPayload.access_token}`,
  },
}).then(res => {
  if (!res.ok) {
    return res.json().then(err => {
      throw err;
    });
  }
  return res.json();
}).catch(err => {
  if (err.message === 'token_expired') { // just an example
    fetch('http://auth.server.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        client_id: client.id,
        grant_type: 'refresh_token',
        refresh_token: authPayload.refresh_token,
      }),
    }).then(res => res.json())
      .catch(payload => {
        // Retry the previous request with the new access_token 
      });
  }
})
```
