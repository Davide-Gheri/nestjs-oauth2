---
 id: client-specification
 title: Client specification
---
 
 A client represents an application that wants to access user information on the OAuth2 server.
 
 ## Scheme
 
 | Name          | Type     | Default                                  | Required | description                                                        |
 |---------------|----------|------------------------------------------|----------|--------------------------------------------------------------------|
 | id            | string   | auto generated                           | true     | Client unique identifier                                           |
 | secret        | string   | auto generated                           | true     | Client secret, think of it as the client password                  |
 | name          | string   |                                          | true     | Human readable Client name                                         |
 | redirect      | string[] |                                          | true     | Array of allowed callback urls for the  `authorization_code` grant |
 | grantTypes    | string[] | [authorization_code]                     |          | Array of allowed grants                                            |
 | responseTypes | string[] | [code]                                   |          | Array of allowed response types                                    |
 | responseModes | string[] | [query]                                  |          | Array of allowed response modes                                    |
 | scopes        | string[] | [openid,email,profile,offline_access]    |          | Array of allowed scopes                                            |
 | firstParty    | boolean  | false                                    |          | Flag as First party client, skip the consent page                  |
 | authMethods   | string[] | [client_secret_post,client_secret_basic] |          | Array of allowed client authentication methods                     |
