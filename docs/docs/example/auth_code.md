---
id: auth_code
title: Authorization code example
---

## Intro

This example demonstrates how to consume the OAuth2 server with a 'classic' server side application (powered by `express`), assuming the OAuth2 server is responding at `http://oauth.server.com` and the client is responding at `http://client.server.com`

### Client data

```js
const client = {
  id: 'c02d5bf5-993e-4c6a-a248-6c307cc7681b',
  secret: 'c5bb2489292fac7711baedd65d87296261d08cdbdde2073c9fdb29941ac5446a',
  redirect: ['http://client.server.com/callback'],
  firstParty: false,
  grantTypes: ['authorization_code'],
  responseTypes: ['code'],
  responseModes: ['query'],
  authMethods: ['client_secret_post'],
  scopes: ['openid', 'email', 'profile', 'offline_access'],
};
```

## Client implementation

### Start authorization flow

```js
const express = require('express');
const app = express();

const sharedState = 'somesecretstatethatshouldmatch';

app.get('/login', (req, res) => {
  // Build the redirect url
  const url = new URL('http://auth.server.com/oauth2/authorize');
  url.searchParams.set('client_id', client.id);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('state', sharedState);
  url.searchParams.set('scope', 'openid email profile offline_access');
  // If omitted, response_mode will default to query
  //url.searchParams.set('response_mode', 'query');
  res.redirect(url.toString());
});
```

The user will be asked to authorize the Client to access its data (because the client is not flagged as `firstParty`), upon user authorization, the server will redirect the user to the given `redirect_uri` callback passing the generated authorization code as the `code` querystring parameter 

### Authorization callback

```js
app.get('/callback', (req, res, next) => {
  const { code, state } = req.query;
  // verify that the state matches the previously passed
  if (state !== sharedState) {
    next(new Error('State mismatch'));
  }
  // Request an access_token
  fetch('http://auth.server.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
        code,
        // Those two fields can be in the payload because client.authMethods includes client_secret_post
        // If client.authMethods included only client_secret_basic, client id and secret has to be passed as Authorization: Basic Header 
        client_id: client.id,
        client_secret: client.secret,
        grant_type: 'authorization_code',
        redirect_uri: 'http://client.server.com/callback',
        scope: 'openid email profile offline_access',
    }),
  }).then(r => r.json()) // TODO handle http errors
    .then(payload => {
      // User is authenticated, payload contains the access_token, the refresh_token and the id_token
      res.json(payload);
    });
});
```
