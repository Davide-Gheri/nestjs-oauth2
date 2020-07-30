FROM node:lts-alpine as clientBuilder

COPY client/package.json .
COPY client/yarn.lock .

COPY client/tsconfig.json .

COPY client/views views
COPY client/public public
COPY client/src src

RUN yarn install

RUN yarn build

FROM node:lts-alpine as builder

RUN apk add python make g++

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY nest-cli.json .
COPY tsconfig.json .
COPY tsconfig.build.json .

COPY src src

ENV NODE_ENV=production

RUN yarn build

FROM node:lts-alpine as prod

WORKDIR /app

COPY --from=builder package.json .
COPY --from=builder yarn.lock .

ENV NODE_ENV=production

RUN yarn install --prod --frozen-lockfile --ignore-optional && \
    rm -rf node_modules/@types && \
    yarn cache clean

COPY ormconfig.js .

COPY --from=builder dist dist

COPY --from=clientBuilder build client/build
COPY --from=clientBuilder views client/views

COPY views views

ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 5000

ENTRYPOINT ["node", "dist/main.js"]

CMD ["serve"]
