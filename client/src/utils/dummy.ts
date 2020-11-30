
export const dummyUser = {
  createdAt: "2020-06-06T15:30:21.069Z",
  email: "admin@admin.com",
  emailVerifiedAt: "2020-06-06T17:30:26.704Z",
  firstName: "admin",
  id: "ec4a402f-834b-44f4-809b-94f9b78dcb44",
  lastName: "admin",
  nickname: "Admin",
  updatedAt: "2020-06-06T15:30:26.737Z",
  picture: "//www.gravatar.com/avatar/8c2eb5c7ebba92486dfdc3aa779649c1?rating=g&default=retro",
  role: "ADMIN",
  tfaEnabled: false,
}

export const dummyGrants = {
  "USER": {},
  "ADMIN": {
    "client": {
      "create:any": [
        "*"
      ],
      "update:any": [
        "*"
      ],
      "delete:any": [
        "*"
      ],
      "read:any": [
        "*"
      ]
    },
    "user": {
      "create:any": [
        "*"
      ],
      "update:any": [
        "*"
      ],
      "delete:any": [
        "*"
      ],
      "read:any": [
        "*"
      ]
    }
  }
}

export const dummySessions = [
  {
    "sessionId": "GH8cIJnzmbRjP-nzGI12vZeQg2R64CW1",
    "ip": "::1",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
    "os": "Mac OS v10.15.3",
    "browser": "Chrome, v83.0.4103.61",
    "createdAt": "2020-06-11T07:48:36.737Z"
  },
  {
    "sessionId": "GfN7SqorycWN7-UBsT4d-7QVMczC2IxO",
    "ip": "::1",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
    "os": "Mac OS v10.15.3",
    "browser": "Chrome, v83.0.4103.61",
    "createdAt": "2020-06-10T07:48:36.737Z"
  },
  {
    "sessionId": "UHY697-ByRcCuaS5t5um2FlTiqn_y7Az",
    "ip": "::1",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
    "os": "Mac OS v10.15.3",
    "browser": "Chrome, v83.0.4103.61",
    "createdAt": "2020-06-09T07:48:36.737Z"
  }
]
