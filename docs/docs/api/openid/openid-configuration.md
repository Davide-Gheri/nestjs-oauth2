---
id: openid-configuration
title: OpenID configuration
---

The OAuth2 server expose an endpoint to get the OpenID Connect config

**Endpoint**: `/.well-known/openid-configuration`

**Method**: `GET`

## Response payload

```json
{
    "response_types_supported": [
      "code"
    ],
    "grant_types_supported": [
        "password",
        "authorization_code",
        "refresh_token",
        "client_credentials"
    ],
    "response_modes_supported": [
        "query",
        "fragment",
        "form_post"
    ],
    "scopes_supported": [
        "openid",
        "email",
        "profile",
        "offline_access"
    ],
    "token_endpoint_auth_methods_supported": [
        "client_secret_post",
        "client_secret_basic",
        "none"
    ],
    "subject_types_supported": [
      "public"
    ],
    "issuer": "http://localhost:4000/",
    "authorization_endpoint": "http://localhost:4000/oauth2/authorize",
    "token_endpoint": "http://localhost:4000/oauth2/token",
    "introspection_endpoint": "http://localhost:4000/oauth2/introspect",
    "revocation_endpoint": "http://localhost:4000/oauth2/revoke",
    "registration_endpoint": "http://localhost:4000/clients",
    "jwks_uri": "http://localhost:4000/.well-known/jwks.json",
    "userinfo_endpoint": "http://localhost:4000/userinfo"
}
```
