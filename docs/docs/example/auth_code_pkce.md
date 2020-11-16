---
id: auth_code_pkce
title: Authorization code with PKCE example
---

## Intro

This example demonstrates how to consume the OAuth2 server with a 'browser' client (authMethods: ['none']), assuming the OAuth2 server is responding at `http://oauth.server.com` and the client is responding at `http://client.server.com`

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
  authMethods: ['none'],
  scopes: ['openid', 'email', 'profile', 'offline_access'],
}
```

## Browser implementation

### Start authorization flow

```js
const sharedState = 'somesecretstatethatshouldmatch';
const codeVerifier = 'RANDOM_GENERATED_STRING';
const codeChallenge = window.btoa(sha256(codeVerifier)); // needs a custom sha256 implementation, example using window.crypto.subtle 

window.localStorage.setItem('state', sharedState);
window.localStorage.setItem('verifier', codeVerifier);

const url = new URL('http://auth.server.com/oauth2/authorize');
url.searchParams.set('client_id', client.id);
url.searchParams.set('response_type', 'code');
url.searchParams.set('state', sharedState);
url.searchParams.set('scope', 'openid email profile offline_access');
url.searchParams.set('code_challenge', codeChallenge);
url.searchParams.set('code_challenge_method', 'SHA-256');

window.location.href = url.toString();
```

The user will be asked to authorize the Client to access its data (because the client is not flagged as `firstParty`), upon user authorization, the server will redirect the user to the given `redirect_uri` callback passing the generated authorization code as the `code` querystring parameter 

### Authorization callback

The following code is assumed to run on `/callback` route
```js

const code = /* retrieve code query string parameter from the url */ 'AUTH_CODE';
const state = /* retrieve state query string parameter from the url */ 'STATE';

const prevState = window.localStorage.getItem('state');
const codeVerifier = window.localStorage.getItem('verifier');

if (state !== prevState) {
 throw new Error('State mismatch');
}

fetch('http://auth.server.com/oauth2/token', {
  method: 'POST',
  headers: { 'Content-type': 'application/json', accept: 'application/json' },
  body: JSON.stringify({
    code,
    client_id: client.id,
    grant_type: 'authorization_code',
    redirect_uri: 'http://client.server.com/callback',
    code_verifier: codeVerifier,
    scope: 'openid email profile offline_access',
  }),
}).then(res => res.json()) // TODO handle http errors
  .then(payload => {
    // User is authenticated, payload contains the access_token, the refresh_token and the id_token
  });
```
