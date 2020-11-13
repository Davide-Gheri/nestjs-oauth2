(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{135:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return i})),n.d(t,"rightToc",(function(){return l})),n.d(t,"default",(function(){return b}));var a=n(2),r=n(9),o=(n(0),n(161)),c={id:"refresh_token",title:"Refresh token grant"},i={id:"api/oauth2/refresh_token",title:"Refresh token grant",description:"The Refresh token grant is used to issue a new access_token without reimplementing all the authorization flow.",source:"@site/docs/api/oauth2/refresh_token.md",permalink:"/nestjs-oauth2/docs/api/oauth2/refresh_token",sidebar:"api",previous:{title:"Password grant",permalink:"/nestjs-oauth2/docs/api/oauth2/password"},next:{title:"Introspection",permalink:"/nestjs-oauth2/docs/api/oauth2/introspection"}},l=[{value:"Request payload",id:"request-payload",children:[{value:"Payload description",id:"payload-description",children:[]}]},{value:"Response payload",id:"response-payload",children:[]}],s={rightToc:l};function b(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(a.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"The Refresh token grant is used to issue a new access_token without reimplementing all the authorization flow."),Object(o.b)("p",null,"The access_token is short lived (few minutes, 1 hour), to avoid a horrible user experience (asking the user to log in every 1 hour), a refresh_token can be issued."),Object(o.b)("p",null,"The refresh token is long lived (months, years) and enable the user to stay logged in for a long time."),Object(o.b)("p",null,"Each refresh token is bound to an access token and cannot be used more the once. When a new access token is issued with the refresh_token grant, a new associated refresh token is issued. The refresh token lifetime is not reset, meaning that if the first refresh_token expiration is in 365d and a new refresh token is issued after 1d, the new refresh token expiration will be 364d.\nWhen 365d are passed, the user must login again.  "),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Endpoint"),": ",Object(o.b)("inlineCode",{parentName:"p"},"/oauth2/token")),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Method"),": ",Object(o.b)("inlineCode",{parentName:"p"},"POST")),Object(o.b)("h2",{id:"request-payload"},"Request payload"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-json"}),'{\n  "client_id": "c02d5bf5-993e-4c6a-a248-6c307cc7681b",\n  "client_secret": "c5bb2489292fac7711baedd65d87296261d08cdbdde2073c9fdb29941ac5446a",\n  "grant_type": "refresh_token",\n  "refresh_token": "REFRESH TOKEN"\n}\n')),Object(o.b)("h3",{id:"payload-description"},"Payload description"),Object(o.b)("table",null,Object(o.b)("thead",{parentName:"table"},Object(o.b)("tr",{parentName:"thead"},Object(o.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Name"),Object(o.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Required"),Object(o.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Default"),Object(o.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Description"))),Object(o.b)("tbody",{parentName:"table"},Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"grant_type"),Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"true"),Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"null"),Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"Must be set as ",Object(o.b)("inlineCode",{parentName:"td"},"client_credentials"))),Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"client_id"),Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"true"),Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"null"),Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"Client id that is requesting access")),Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"client_secret"),Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"false"),Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"null"),Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"Client secret that is requesting access")),Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"refresh_token"),Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"true"),Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"null"),Object(o.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"The refresh token associated with the current access token")))),Object(o.b)("h2",{id:"response-payload"},"Response payload"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-json"}),'{\n  "access_token": "JWT TOKEN",\n  "refresh_token": "NEW REFRESH TOKEN"\n}\n')))}b.isMDXComponent=!0},161:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return O}));var a=n(0),r=n.n(a);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=r.a.createContext({}),b=function(e){var t=r.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=b(e.components);return r.a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},d=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),p=b(n),d=a,O=p["".concat(c,".").concat(d)]||p[d]||u[d]||o;return n?r.a.createElement(O,i(i({ref:t},s),{},{components:n})):r.a.createElement(O,i({ref:t},s))}));function O(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,c=new Array(o);c[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,c[1]=i;for(var s=2;s<o;s++)c[s]=n[s];return r.a.createElement.apply(null,c)}return r.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);