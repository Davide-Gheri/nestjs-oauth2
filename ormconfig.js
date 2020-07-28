const isTest = process.env.NODE_ENV === 'test';

module.exports = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: process.env.NODE_ENV === 'debug',
  cli: {
    migrationsDir: 'src/apps/init/db/migrations',
    entitiesDir: 'src/apps/oauth2/entities',
  },
  migrations: isTest ? [
    'src/apps/init/db/migrations/**/*.ts'
  ] : [
    'dist/apps/init/db/migrations/**/*.js'
  ],
  entities: isTest ? [
    'src/apps/oauth2/entities/**/*.ts',
  ] : [
    'dist/apps/oauth2/entities/**/*.js'
  ],
};
