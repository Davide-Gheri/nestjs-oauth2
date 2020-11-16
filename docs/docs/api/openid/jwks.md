---
id: jwks
title: Json Web Token Set
---

The OAuth2 server expose an endpoint to get the JWK Set needed to verify the issued JWTs signature

**Endpoint**: `/.well-known/jwks.json`

**Method**: `GET`

## Response payload

```json
{
    "keys": [
        {
            "e": "AQAB",
            "n": "wyRq0JTfWuIcbcSMxIsD1KAaQnRDrsc5txOV5WKB3jHc_s5jidfXUy1Y50qsCAvj2KMp0ljiT3J-pOaWBSGhZRG7yfhERVKLSVy1mR1m8SsVAh9GCwS2t69xgCEau9dNwqOSxdI3rg1Onnr7gK_hbaDL2nrzwEhA4XHY6kiwRZ0LzQIOPpuUYHiZOke1PEZ9TO6z7nad1kdwEuFk0wqbtJv8d7CVoMEZMO7aRZ7QEcQUp013cPwXheCPMKi2xfafYCgKXLeQ_EwTThIilD0Eif9GrPNID-axZVJAs9HkLRCy7mJ9NUyEZvdyO5lBFRvSQtJ1vY6_ci-8SEme66Kwye9SrZKCHXvgEkVK7ylkt6svpoPNU0A0pmNYHDM9VDZDQXCEPcPZAvCYZiY3rttb19MEoNohuxX47mTCf4LpFWoaj6-JgQVhCq1zJfhjMEgISHP83_VVT2Jkf3SEJ3BUaiR_15jORga-eQE17oskiLIEPyBqke1eqBaD6WlhqFGcVCSuyeAJNRz1MBOegg7mvsY9aMhM-jwU9BOen5Nf-Vhee6TcKOegRwupnAjbNpBn6Ok4-h2OHI-8nDYdSSliXMVp2JX08GrBh7OixhaWzvgldMMBN2OJms0ds7wb4y3xGrqDbL4UXm1vjv1wyqdlGasZIGp5Y7Prz3I9xJ3tKbk",
            "kty": "RSA",
            "kid": "7Ow7Aw8-r2Lq2sy0fyIdC52320pdfrRlMs6HTEYTrmo",
            "alg": "RS256",
            "use": "sig"
        },
        {
            "e": "AQAB",
            "n": "yYetxAjLHRSaTpEWalFrm5vfEsJSOrXsq4TX5hqoO6KeV6S_BVPL8OWR4hsClUuQONsX6oXAvq1V8uNUhkrzJeBhDa7z1ymIbuskhJ3zTouseZSpzD1vNpWut5qVIDTO75aswkGQERBzYgbpuMTcUnhPP1YbK2iNcjUY7RzQRHBp1slBzf9-AxEnoP9JJKWfV0OXlao-kWOgmFOWy4kK8qEtUSyCSIy61wF3v22imPP9pQl82P3zPqmWMhU0o4s-ksS9PJvu-iwQyLht4f43FK-BdUHzyelQpWkG5UU17hDe3x6g_IFvv0rFn5GnutNaxfwxCNX56A0JQYBA9p5uNwn_vXTOtmcSZrRVR0Z55N61WE_NLTVRZUv_rHzFRneX2xTeeJbRBuyzaofgWExpparGk69TQaX8QSl0ChWmFXbVwpk7-ltp0NZ1UUbo-0RwGSIk5U5LFraZVU5qUqKRXvBrqJPqqCv6eQlGtRLbRZQgdnCWf2KO4nUrIUxKhChiZCMo5INFK7P9B6ey2zB-dPs7TS1WaZ9Y6A8it99HKj9AvQr-NMgr9NrMb1X8MxD5ShOyAtj7-uqSLSKO-XzbK5Sw8EG7cBCffMGdU3uA1pxZw2BwlykO3F9z1GOmRPkEbda1qa0E26OC2sssCcI-7rQabEQrP09rTsAkcPuDJFU",
            "kty": "RSA",
            "kid": "64c2sxeU0xhZSilsIgegqZSv4sNa3JFkx8J07wMZ3Lw",
            "alg": "RS256",
            "use": "sig"
        }
    ]
}
```
