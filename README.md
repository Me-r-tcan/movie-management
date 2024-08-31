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

## Explanation of Approach, Decisions, and Challenges

In implementing the provided entities and services for a movie management system, I followed a structured approach to ensure the application's functionality, maintainability, and scalability. Here is a breakdown of the approach, decisions made, and challenges faced:

### 1. Entities and Relationships Design

**Approach:**

- Designed the entities (`Movie`, `Session`, `Ticket`, `User`) to represent the core components of the movie management system. Each entity reflects the relationships and constraints relevant to the domain.

**Decisions:**

- **`Movie` Entity:** Represents a movie with its unique ID, name, and age restriction. It has a one-to-many relationship with the `Session` entity, as a movie can have multiple sessions.
- **`Session` Entity:** Represents a session (showtime) for a movie, with properties like date, time slot, and room number. It has a many-to-one relationship with the `Movie` entity and a many-to-many relationship with the `User` entity (for tracking which users have watched the session).
- **`Ticket` Entity:** Represents a ticket purchased by a user for a session. It has many-to-one relationships with both the `User` and `Session` entities.
- **`User` Entity:** Represents a user of the system, which can either be a manager or a customer. It has one-to-many relationships with the `Ticket` entity and many-to-many relationships with the `Session` entity (to track watched sessions).

**Challenges:**

- Ensuring the correct relationships between entities while avoiding circular dependencies and maintaining data integrity.
- Deciding on using `@ManyToMany` relationships (e.g., between `Session` and `User`) and ensuring proper cascade and join configurations.

### 2. Service Layer Implementation

**Approach:**

- Created separate service classes (`MovieService`, `SessionService`, `TicketService`) to encapsulate the business logic for managing movies, sessions, and tickets. This separation of concerns makes the code easier to maintain, test, and extend in the future.

**Decisions:**

- **`MovieService`:** Handles CRUD operations for movies. It checks for the existence of a movie before updating or deleting it to ensure data integrity.
- **`SessionService`:** Manages operations related to sessions, such as allowing a user to watch a session and fetching a user’s watch history. It ensures that all necessary checks (like verifying if the session exists, if the user has a valid ticket, and if the user has already watched the session) are performed before proceeding with any operations.
- **`TicketService`:** Handles ticket purchase logic and checks if a user is eligible to buy a ticket (e.g., checks age restrictions against the movie's age requirement). It also provides the `canWatch` method to check if a user has a valid ticket for a session.

**Challenges:**

- Ensuring that each service properly handles exceptions and maintains data consistency. For example, in `TicketService`, ensuring that a user meets the age restriction before purchasing a ticket and that proper error handling is in place.
- Deciding how to handle cascade operations, especially when deleting or updating entities to avoid orphaned data or inconsistencies.

### 3. Repository Layer Customization

**Approach:**

- Used custom repositories (e.g., `UserRepository`, `MovieRepository`) to extend the default TypeORM repository behavior and encapsulate complex queries or specific data retrieval logic.

**Decisions:**

- **Custom Repositories:** The `UserRepository` contains methods like `findByUsername` and `createUser` to encapsulate specific logic related to users, making the service layer cleaner and more focused on business logic rather than data access.
- **Separation of Concerns:** By separating repository logic from services, the application becomes more modular and easier to maintain. This approach also makes it easier to mock repositories in unit tests.

**Challenges:**

- Designing repository methods that balance flexibility and specificity. For example, determining whether to create a single repository method that handles multiple types of queries or to create several specific methods for different use cases.
- Ensuring that custom repositories properly extend the TypeORM repository and correctly manage transactions and entity lifecycle events.

### 4. Error Handling and Validation

**Approach:**

- Implemented comprehensive error handling to manage different error scenarios (e.g., `NotFoundException`, `ForbiddenException`). This ensures that the application provides meaningful feedback to the user and maintains consistent behavior.

**Decisions:**

- Use NestJS built-in exceptions like `NotFoundException` and `ForbiddenException` to standardize error handling across the application.
- Ensure that each service method performs all necessary checks (like existence checks, authorization checks) before executing any operations that modify data.

**Challenges:**

- Balancing between throwing exceptions for error scenarios and handling errors gracefully in a way that provides meaningful feedback without revealing too much internal information.
- Ensuring that error handling does not obscure or suppress important errors that could indicate underlying issues in the system.

### 5. Testing Strategy

**Approach:**

- The test suite includes unit tests for each service, ensuring that all critical functionalities (like creating movies, buying tickets, watching sessions) are covered. This approach helps verify that each service correctly implements the desired business logic.

**Decisions:**

- **Unit Tests:** Focus on testing the individual methods in isolation using mocks for dependencies (e.g., repositories, other services). This helps in verifying that each method behaves as expected under different conditions.
- **End-to-End Tests (E2E):** Will be used to test the overall application behavior, including controller endpoints, to ensure the full flow of creating movies, sessions, buying tickets, etc., works correctly.

**Challenges:**

- Ensuring that the unit tests are comprehensive enough to cover all possible edge cases (like invalid inputs, missing entities, etc.) without being too tightly coupled to the implementation details.
- Managing dependencies between services and repositories in tests to ensure that they are properly mocked and do not interfere with each other.
