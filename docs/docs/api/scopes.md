---
id: scopes
title: Scopes
---

Scopes are keys used by the application to attach permissions to a specific `access_token`.
A scope can represent everything and be in every format, a common format to describe CRUD operations is `entity:action` (`page:edit`, `page:delete` ecc...).

These scopes are generally used by the client application to handle what the `access_token` (the user) can do in its application.

## OpenID scopes

There are though some default scopes, defined by the **OpenID** connect specification, that generally describes what user information the client app has requesting access; the commonly used are:

### openid
parent scope, required to ask for any other openid scopes. By default, gives access just to the user id

### email
gives access to the user email and email related info (email verified, email verified at ecc...)

### profile
gives access to many other user fields (name, picture, ecc...)

## ID token

When the `openid` scope is requested, the `/oauth/token` response payload will include a new field, `id_token`.
The `id_token` field is a JWT containing the requested openid user info. It does not give access to any api (it is not an access_token), it is just an handy way to pass the requested user information in the same request.

## Other OAuth2 scopes

To issue a `refresh_token`, a client must explicitly ask for it and an user must explicitly authorize it.
This is done with the `offline_access` scope.
If an authorization request includes this scope, the `/oauth/token` response payload will include a new field, `refresh_token`, containing the refresh token associated with the response `access_token`.
