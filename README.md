# Trackio Backend

REST API built with NestJS and PostgreSQL using Drizzle ORM. Includes JWT authentication with Role-Based Access Control (RBAC) and multi-tenant support.

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp .env.template .env
# Edit .env with your values

# 3. Start database
docker-compose up -d

# 4. Run migrations
pnpm db:generate
pnpm db:migrate

# 5. Start dev server
pnpm dev

# 6. (Optional) Seed initial data
# GET http://localhost:3000/api/v1/seed
```

## Installation and Setup

### 1. Clone the project

```bash
git clone <repository-url>
cd trackio-backend
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.template .env
```

Edit the `.env` file with your values:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_NAME=trackio_dev

# Application
PORT=3000
HOST_API=http://localhost:3000/api/v1

# Authentication
JWT_SECRET=your_jwt_secret_min_32_chars
```

### 4. Start the database

```bash
docker-compose up -d
```

> **Note:** The database will be created automatically with the name specified in `DB_NAME`.

To check if PostgreSQL is ready:

```bash
docker-compose ps
# Should show "healthy" status
```

### 5. Generate and run migrations

```bash
pnpm db:generate
pnpm db:migrate
```

### 6. Start the development server

```bash
pnpm dev
```

### 7. (Optional) Run the initial data seed

```
GET http://localhost:3000/api/v1/seed
```

## API Documentation

Swagger UI available at:

```
http://localhost:3000/api/v1/swagger
```

## Available Scripts

### Development

```bash
pnpm dev               # Start server with hot reload
pnpm start:debug       # Start in debug mode
```

### Production

```bash
pnpm build             # Build project
pnpm start:prod        # Start in production
```

### Database

```bash
pnpm db:generate       # Generate Drizzle migrations
pnpm db:migrate        # Run migrations
pnpm db:push           # Push schema changes (dev only)
pnpm db:studio         # Open Drizzle Studio (visual UI)
```

### Testing

```bash
pnpm test              # Run unit tests
pnpm test:watch        # Run tests in watch mode
pnpm test:cov          # Run tests with coverage
pnpm test:e2e          # Run end-to-end tests
```

### Code Quality

```bash
pnpm lint              # ESLint with auto-fix
pnpm format            # Format with Prettier
```

## Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs -f db

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d
```

## Authentication

JWT authentication endpoints:

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/check-status` - Check authentication status

## User Roles

- **ADMIN** - Full system access
- **USER** - Limited access
- **SUPER_USER** - Super admin access

## Multi-tenant Architecture

- Each **Organization** is an isolated tenant
- **Users** belong to an organization
- All data is scoped by `organizationId`

## Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** JWT + Passport
- **Validation:** class-validator + class-transformer
- **Documentation:** Swagger/OpenAPI
- **Storage:** AWS S3
- **Logging:** Winston

## Project Structure

```
src/
├── domain/          # Business logic (entities, repositories interfaces)
├── application/     # Use cases and DTOs
├── infrastructure/  # Database, auth, storage implementations
└── interface/       # HTTP controllers
```

See [CLEAN_ARCHITECTURE.md](./CLEAN_ARCHITECTURE.md) for detailed documentation.
