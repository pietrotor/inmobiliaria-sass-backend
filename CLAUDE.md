# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NestJS-based REST API with PostgreSQL database using Drizzle ORM. The project includes JWT authentication with role-based access control (RBAC), multi-tenant support, and database seeding capabilities.

## Development Commands

**Setup:**
```bash
# Install dependencies
yarn install

# Setup environment
cp .env.template .env
# Edit .env with your database credentials

# Start PostgreSQL database
docker-compose up -d

# Generate and run Drizzle migrations
npm run db:generate
npm run db:migrate
```

**Development:**
```bash
# Start development server with hot reload
yarn dev

# Run database seed (populates initial data)
# Access: http://localhost:3000/api/v1/seed
```

**Build & Production:**
```bash
yarn build
yarn start:prod
```

**Testing:**
```bash
yarn test              # Run unit tests
yarn test:watch        # Watch mode
yarn test:cov          # With coverage
yarn test:e2e          # End-to-end tests
```

**Code Quality:**
```bash
yarn lint              # ESLint with auto-fix
yarn format            # Prettier formatting
```

## Architecture

**IMPORTANT:** This project follows **Clean Architecture Lite** principles. See [CLEAN_ARCHITECTURE.md](./CLEAN_ARCHITECTURE.md) for complete documentation.

### Layered Architecture

The project is organized into 4 main layers:

1. **Domain Layer** (`src/domain/`): Core business logic, entities, and repository interfaces
2. **Application Layer** (`src/application/`): Use cases and DTOs
3. **Infrastructure Layer** (`src/infrastructure/`): Database, auth services, storage, and repository implementations
4. **Interface Layer** (`src/interface/`): HTTP controllers, guards, and decorators

**Dependency Rule:** Domain <- Application <- Interface, with Infrastructure implementing Domain contracts.

### Domain Layer (`src/domain/`)

Contains pure business logic with no external dependencies:

- **Entities:** Business objects with behavior (e.g., `User` with methods like `hasRole()`, `isAdmin()`)
- **Repository Interfaces:** Contracts defining data access operations
- **Value Objects:** Enums and immutable types (e.g., `Role` enum)

### Application Layer (`src/application/`)

Orchestrates use cases using domain entities and repositories:

- **Use Cases:** Business operations like `CreateUserUseCase`, `LoginUserUseCase`
- **DTOs:** Input/output data transfer objects with validation

### Infrastructure Layer (`src/infrastructure/`)

Implements technical details and external dependencies:

- **Persistence:**
  - **Location:** `src/infrastructure/persistence/drizzle/`
  - **Schema:** Database models in `schema/user.schema.ts`, `schema/organization.schema.ts`
  - **Mappers:** Convert between database schemas and domain entities
  - **Repositories:** Concrete implementations of domain repository interfaces
- **Auth Services:**
  - **BcryptService:** Password hashing (salt rounds: 10)
  - **JwtStrategy:** Token validation using Passport
- **Storage:**
  - **S3Service:** AWS S3 file storage

### Interface Layer (`src/interface/http/`)

Exposes application functionality via HTTP:

- **Controllers:** HTTP endpoints that invoke use cases
- **Guards:** `UserRoleGuard` for role-based access control
- **Decorators:** `@Auth()`, `@GetUser()`, `@RoleProtected()`, `@RawHeaders()`

### Authentication System

- **Strategy:** JWT-based authentication using Passport
- **Token Lifetime:** 160 hours
- **Flow:**
  1. User registers/logs in via `AuthController`
  2. Use case validates credentials using `UserRepository`
  3. JWT token generated with user ID payload
  4. `JwtStrategy` validates tokens and retrieves user via repository
  5. `UserRoleGuard` checks roles from `@Auth()` decorator

**User Entity:**
- UUID-based IDs
- Fields: name, lastName, email, phoneNumber, password, isActive, organizationId
- Roles: `Role[]` enum (ADMIN, USER, SUPER_USER)
- Soft delete support via `deleted` boolean field
- Business methods: `hasRole()`, `isAdmin()`, `isSuperUser()`

**Organization Entity:**
- UUID-based IDs
- Fields: name, email, phone, address, isActive
- Multi-tenant root entity
- Soft delete support via `deleted` boolean field

### API Configuration

- **Global prefix:** `/api/v1`
- **Port:** Configured via `process.env.PORT`
- **Validation:** Global ValidationPipe with `whitelist: true` and `forbidNonWhitelisted: true`
- **Documentation:** Swagger UI at `/api/v1/swagger` endpoint
- **Static files:** Served from `public/` directory

### Environment Variables

Required in `.env`:
- `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`, `DB_USERNAME` - PostgreSQL connection
- `PORT` - Application port (default: 3000)
- `HOST_API` - Base API URL for references
- `JWT_SECRET` - Secret for JWT signing
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET` - S3 storage (optional)

## Key Implementation Notes

1. **Clean Architecture Principles:**
   - Always create new features following the layered structure
   - Domain entities should contain business logic, not just data
   - Use cases should orchestrate domain entities, not contain business logic
   - Infrastructure should never leak into domain or application layers
   - Controllers should be thin, only calling use cases

2. **Adding New Features:**
   - Start with Domain: Create entity, repository interface, and value objects
   - Then Infrastructure: Implement repository, create mappers and schemas
   - Then Application: Create use cases and DTOs
   - Finally Interface: Create controllers and wire up in modules
   - See [CLEAN_ARCHITECTURE.md](./CLEAN_ARCHITECTURE.md) for step-by-step guide

3. **Dependency Injection:**
   - Repository interfaces are injected using tokens (e.g., `USER_REPOSITORY`)
   - Implementations are provided in module configuration
   - Use `@Inject(TOKEN)` to inject repository interfaces in use cases
   - Example:
     ```typescript
     constructor(@Inject(USER_REPOSITORY) private repo: UserRepository) {}
     ```

4. **Database Layer (Drizzle ORM):**
   - Schemas: `src/infrastructure/persistence/drizzle/schema/`
   - Mappers convert between schemas and domain entities
   - Repository implementations use `DrizzleService.db`
   - Queries: `await this.drizzle.db.select().from(users).where(eq(users.id, id))`
   - Use `drizzle-kit generate` and `drizzle-kit migrate` for migrations

5. **Testing Strategy:**
   - Unit test use cases by mocking repository interfaces
   - Integration test controllers with real database
   - Domain entities can be tested in isolation (no mocks needed)

6. **Database Seeding:**
   - Implemented as `SeedUsersUseCase` in application layer
   - Endpoint: `GET /api/v1/seed` (use with caution in production)
   - Deletes all users and organizations, then recreates from seed data

7. **Error Handling:**
   - Use cases handle database errors (e.g., unique constraint violations)
   - Domain exceptions in `src/domain/common/exceptions/`
   - Postgres error code `23505` -> `BadRequestException`

8. **Multi-tenant Support:**
   - All entities belong to an Organization
   - Users have `organizationId` field
   - Data should be scoped by organizationId in queries
