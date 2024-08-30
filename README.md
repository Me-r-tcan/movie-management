# Backend Project README

## Description

This project is a backend application developed using Nest.js and Type ORM. The application provides API endpoints to manage movie management system.

## Environment Variables

Before running the project, ensure that the following environment variables are set in a `.env.dev` file:

```plaintext
JWT_SECRET=very-secure-secret-key
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=pgpass
DB_NAME=movie_db
```

## Installing Dependencies

To install the project dependencies, run the following command:

```bash
npm install
```

## DB Migrate

To create migration files you can use following command:

```bash
npm run migration:generate -- ./src/db/migrations/migration_name
```

To apply migration files you can use following command:

```bash
npm run migration:run
```

To revert migration files you can use following command:

```bash
npm run migration:revert
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

# Test Enviroment Variables
Before running the tests, ensure that the following environment variables are set in a `.env.test` file:

```plaintext
NODE_ENV=test
JWT_SECRET=very-secure-secret-key
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=pgpass
DB_NAME=movie_db_test
```

# Test Command

```bash
# e2e tests
$ npm run test:e2e -- --runInBand

# unit tests
$ npm run test
```