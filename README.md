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



## Usage Examples

### Create a new customer
```plaintext
curl -X 'POST' \
  'http://localhost:3000/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "john_doe",
  "password": "strongPassword123",
  "age": 28,
  "role": "customer"
}'
```

### Create a new manager
```plaintext
curl -X 'POST' \
  'http://localhost:3000/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "manager",
  "password": "strongPassword123",
  "age": 28,
  "role": "manager"
}'
```

### Login user
```plaintext
curl -X 'POST' \
  'http://localhost:3000/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "john_doe",
  "password": "strongPassword123"
}'
```

### Create a new movie
```plaintext
curl -X 'POST' \
  'http://localhost:3000/movies' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Inception",
  "ageRestriction": 16,
  "sessions": [
    {
      "date": "2024-08-30",
      "timeSlot": "10.00-12.00",
      "roomNumber": 1
    },
    {
      "date": "2024-08-30",
      "timeSlot": "12.00-14.00",
      "roomNumber": 2
    }
  ]
}'
```

### List all movies

```plaintext
curl -X 'GET' \
  'http://localhost:3000/movies' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbmFnZXIiLCJzdWIiOjQsImFnZSI6MjgsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzI1MDU3NTAzLCJleHAiOjE3MjUwNjExMDN9.bIsWnCJ2rRVCap-JCpNDnte5E5Na4evXEfFDnWsW-OU'
```

### Update a specific movie

```plaintext
curl -X 'PATCH' \
  'http://localhost:3000/movies/1' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbmFnZXIiLCJzdWIiOjQsImFnZSI6MjgsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzI1MDU3NTAzLCJleHAiOjE3MjUwNjExMDN9.bIsWnCJ2rRVCap-JCpNDnte5E5Na4evXEfFDnWsW-OU' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Inception",
  "ageRestriction": 16,
  "sessions": [
    {
      "date": "2024-08-30",
      "timeSlot": "10.00-12.00",
      "roomNumber": 1
    },
    {
      "date": "2024-08-30",
      "timeSlot": "12.00-14.00",
      "roomNumber": 2
    }
  ]
}'
```

### Get a specific movie

```plaintext
curl -X 'GET' \
  'http://localhost:3000/movies/1' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbmFnZXIiLCJzdWIiOjQsImFnZSI6MjgsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzI1MDU3NTAzLCJleHAiOjE3MjUwNjExMDN9.bIsWnCJ2rRVCap-JCpNDnte5E5Na4evXEfFDnWsW-OU'
```

### Delete a specific movie

```plaintext
curl -X 'DELETE' \
  'http://localhost:3000/movies/1' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbmFnZXIiLCJzdWIiOjQsImFnZSI6MjgsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzI1MDU3NTAzLCJleHAiOjE3MjUwNjExMDN9.bIsWnCJ2rRVCap-JCpNDnte5E5Na4evXEfFDnWsW-OU'
```

### Buy a ticket

```plaintext
curl -X 'POST' \
  'http://localhost:3000/tickets/1/buy' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbmFnZXIiLCJzdWIiOjQsImFnZSI6MjgsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzI1MDU3NTAzLCJleHAiOjE3MjUwNjExMDN9.bIsWnCJ2rRVCap-JCpNDnte5E5Na4evXEfFDnWsW-OU' \
  -d ''
```

### Watch a movie

```plaintext
curl -X 'POST' \
  'http://localhost:3000/sessions/1/watch' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbmFnZXIiLCJzdWIiOjQsImFnZSI6MjgsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzI1MDU3NTAzLCJleHAiOjE3MjUwNjExMDN9.bIsWnCJ2rRVCap-JCpNDnte5E5Na4evXEfFDnWsW-OU' \
  -d ''
```

### Get all watched movies

```plaintext
curl -X 'GET' \
  'http://localhost:3000/sessions/history' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbmFnZXIiLCJzdWIiOjQsImFnZSI6MjgsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzI1MDU3NTAzLCJleHAiOjE3MjUwNjExMDN9.bIsWnCJ2rRVCap-JCpNDnte5E5Na4evXEfFDnWsW-OU'
```
