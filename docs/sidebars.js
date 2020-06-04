module.exports = {
  docs: [
    {
      type: 'doc',
      id: 'getting-started',
    },
    {
      type: 'doc',
      id: 'client-specification',
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'example/auth_code',
        'example/auth_code_pkce',
        'example/client_credentials',
        'example/password',
        'example/refresh_token'
      ]
    }
  ],
  api: [
    {
      type: 'doc',
      id: 'api/introduction',
    },
    {
      type: 'doc',
      id: 'api/scopes',
    },
    {
      type: 'category',
      label: 'OAuth2',
      items: [
        'api/oauth2/authorization_code',
        'api/oauth2/client_credentials',
        'api/oauth2/password',
        'api/oauth2/refresh_token',
        'api/oauth2/introspection',
      ],
    },
    {
      type: 'category',
      label: 'OpenID',
      items: [
        'api/openid/openid-configuration',
        'api/openid/userinfo',
        'api/openid/jwks',
      ],
    },
  ],
};
