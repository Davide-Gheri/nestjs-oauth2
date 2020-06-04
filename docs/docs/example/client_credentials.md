---
id: client_credentials
title: Client credentials example
---

## Intro

This example demonstrates how to consume the OAuth2 server using the client_credentials grant with a server side application (powered by `express`), assuming the OAuth2 server is responding at `http://oauth.server.com` and the client server is responding at `http://client.server.com`

### Client data

```js
const client = {
  id: 'c02d5bf5-993e-4c6a-a248-6c307cc7681b',
  secret: 'c5bb2489292fac7711baedd65d87296261d08cdbdde2073c9fdb29941ac5446a',
  grantTypes: ['client_credentials'],
  authMethods: ['client_secret_post'],
  //...
}
```

## Server implementation

### Get the Client token

```js
const fetch = require('node-fetch');

// Request an access_token
fetch('http://auth.server.com/oauth2/token', {
  method: 'POST',
  headers: { 'Content-type': 'application/json', accept: 'application/json' },
  body: JSON.stringify({
    code,
    client_id: client.id,
    client_secret: client.secret,
    grant_type: 'client_credentials',
  }),
}).then(r => r.json()) // TODO handle http errors
.then(payload => {
  // Client is authenticated, payload contains the access_token
});
```
