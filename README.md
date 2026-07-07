# NestJS Basecode 2

A NestJS starter API with PostgreSQL, TypeORM, request validation, structured logging, response interceptors, pagination helpers, and an example CRUD module.

## Tech Stack

- NestJS 11
- TypeScript
- PostgreSQL
- TypeORM
- class-validator and class-transformer
- nestjs-pino / Pino logger
- Jest
- Docker

## Project Structure

```text
src/
  config/              Environment, database, and TypeORM config
  database/            TypeORM data source and migrations
  entities/            TypeORM entities
  modules/example/     Example CRUD module
  utils/               Shared filters, interceptors, helpers, and base DTOs
```

## Requirements

- Node.js 22 or newer
- npm
- PostgreSQL
- Docker, optional

## Environment Variables

Create a `.env` file in the project root:

```env
APP_NAME=nestjs-basecode-2
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=nestjs_basecode_2
```

The app validates these values on startup and will fail fast if any required value is missing or if `PORT` / `DATABASE_PORT` is invalid.

## Installation

```bash
npm install
```

## Database Setup

Make sure PostgreSQL is running and create the database configured in `.env`.

Example with `psql`:

```bash
createdb nestjs_basecode_2
```

Run migrations after building the project:

```bash
npm run build
npm run migration:run
```

To revert the latest migration:

```bash
npm run migration:revert
```

To create a new migration:

```bash
npm run migration:create --name=your-migration-name
```

TypeORM synchronization is disabled, so schema changes should be handled through migrations.

## Running the App

Development:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm run start:prod
```

The API uses the global prefix `/api`. With the default port, the base URL is:

```text
http://localhost:3000/api
```

## Docker

Build and run the app container:

```bash
docker compose up --build
```

The compose file reads environment variables from `.env` and exposes `${PORT:-3000}:3000`.

Note: the included `docker-compose.yml` runs only the application container. Use an external PostgreSQL instance or extend the compose file with a database service.

## API Usage

Health/root endpoint:

```bash
curl http://localhost:3000/api
```

Create an example:

```bash
curl -X POST http://localhost:3000/api/examples \
  -H "Content-Type: application/json" \
  -d '{"name":"Example item","status":"active"}'
```

List examples:

```bash
curl "http://localhost:3000/api/examples?page=1&limit=10&status=active&sort=createdAt:DESC"
```

Get one example:

```bash
curl http://localhost:3000/api/examples/{id}
```

Update an example:

```bash
curl -X PATCH http://localhost:3000/api/examples/{id} \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated item","status":"inactive"}'
```

Delete an example:

```bash
curl -X DELETE http://localhost:3000/api/examples/{id}
```

Supported example statuses:

- `active`
- `inactive`

List query parameters:

- `page`: page number, defaults to `1`
- `limit`: page size, defaults to `10`
- `status`: filter by `active` or `inactive`
- `sort`: comma-separated field sorting, for example `createdAt:DESC,name:ASC`

## Response Format

Single-resource responses are wrapped like this:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Example item",
    "status": "active",
    "createdAt": "2026-07-07T00:00:00.000Z",
    "updatedAt": "2026-07-07T00:00:00.000Z"
  }
}
```

Paginated responses are wrapped like this:

```json
{
  "success": true,
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "data": []
}
```

## Scripts

```bash
npm run build          # Compile TypeScript
npm run start          # Start the app
npm run start:dev      # Start with watch mode
npm run start:debug    # Start with debug mode and watch mode
npm run start:prod     # Run compiled app from dist
npm run lint           # Run ESLint with auto-fix
npm run format         # Format source and test files
npm run test           # Run unit tests
npm run test:watch     # Run unit tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests
```

## Development Notes

- Request validation is enabled globally with whitelisting and implicit type conversion.
- Unknown request body fields are rejected with `forbidNonWhitelisted`.
- Global exceptions are normalized by `GlobalExceptionFilter`.
- Logs use Pino, with pretty logs outside production.
- Deleted examples use TypeORM soft delete via `deleted_at`.
