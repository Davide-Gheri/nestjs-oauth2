FROM node:lts-alpine as builder

RUN apk add python make g++

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY nest-cli.json .
COPY tsconfig.json .
COPY tsconfig.build.json .

COPY src src
COPY views views

ENV NODE_ENV=production

RUN yarn build

FROM node:lts-alpine as prod

WORKDIR /app

COPY client/build client/build
COPY client/views client/views

COPY --from=builder package.json .
COPY --from=builder yarn.lock .

COPY --from=builder dist dist

ENV NODE_ENV=production

RUN yarn install --prod --frozen-lockfile --ignore-optional && \
    rm -rf node_modules/@types && \
    yarn cache clean

COPY ormconfig.js .

ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 5000

ENTRYPOINT ["node", "dist/main.js"]

CMD "serve"
