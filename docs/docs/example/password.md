---
id: password
title: Password example
---

## Intro

This example demonstrates how to consume the OAuth2 server using the password grant with a MVC application, assuming the OAuth2 server is responding at `http://oauth.server.com` and the client is responding at `http://client.server.com`

### Client data

```js
const client = {
  id: 'c02d5bf5-993e-4c6a-a248-6c307cc7681b',
  secret: 'c5bb2489292fac7711baedd65d87296261d08cdbdde2073c9fdb29941ac5446a',
  firstParty: false,
  grantTypes: ['password'],
  authMethods: ['client_secret_post'],
  scopes: ['openid', 'email', 'profile', 'offline_access'],
  //...
}
```

## Client implementation

Assuming a form like this

```html
<form method="post" action="/login">
    <input type="email" name="email" id="name">
    <input type="password" name="password" id="password">
    <button type="submit">Login</button>
</form>
```

### Handle the user login

```js

const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.post('/login', (req, res) => {
  const payload = req.body;
  
  fetch('http://auth.server.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        username: payload.email,
        password: payload.password,
        client_id: client.id,
        client_secret: client.secret,
        grant_type: 'password',
        scope: 'openid email profile',
      }),
    }).then(r => r.json()) // TODO handle http errors
      .then(payload => {
        // Client is authenticated, payload contains the access_token
      });
});
```
