# Inmobiliaria SaaS Backend

REST API para plataforma inmobiliaria multi-tenant. Cada empresa inmobiliaria tiene su propio portal de propiedades y sistema de gestión interno.

Built with NestJS + PostgreSQL + Drizzle ORM. Includes JWT/RBAC authentication, property management, location catalog, multi-currency pricing, and AI-powered natural language search via OpenAI.

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

# 6. (Optional) Seed all data (users, locations, properties)
# GET http://localhost:3000/api/v1/seed/all
```

## Installation and Setup

### 1. Clone the project

```bash
git clone <repository-url>
cd inmobiliaria-sass-backend
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

# OpenAI (for AI-powered search)
OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
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

### 7. Seed initial data

Run the seeds **in order** or use the "all" endpoint:

| Endpoint | Description |
|---|---|
| `GET /api/v1/seed` | Users + organizations only |
| `GET /api/v1/seed/properties` | Locations (13 countries, ~50 cities, ~87 neighborhoods) + 12 sample properties with images and multi-currency prices |
| `GET /api/v1/seed/all` | Everything in order (recommended) |

> **Important:** Run `GET /api/v1/seed` before `GET /api/v1/seed/properties` if seeding individually. The properties seed requires at least one organization to exist.

## API Documentation

Swagger UI available at:

```
http://localhost:3000/api/v1/swagger
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login | No |
| GET | `/auth/check-status` | Check auth status | Yes |

### Organizations

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/organizations` | Create organization | ADMIN, SUPER_USER |
| GET | `/organizations` | List all organizations | Yes |
| GET | `/organizations/:id` | Get organization by ID | Yes |
| PUT | `/organizations/:id` | Update organization | ADMIN |
| DELETE | `/organizations/:id` | Delete organization | ADMIN |

### Properties

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/properties` | Create property | ADMIN, USER |
| GET | `/properties` | List properties (with filters & pagination) | No |
| GET | `/properties/:id` | Get property details + images + prices | No |
| PUT | `/properties/:id` | Update property | ADMIN, USER |
| DELETE | `/properties/:id` | Soft delete property | ADMIN |
| POST | `/properties/:id/images` | Add image to property | ADMIN, USER |
| DELETE | `/properties/images/:imageId` | Delete property image | ADMIN, USER |
| POST | `/properties/ai-search` | AI-powered natural language search | No |

### Locations

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/locations/countries` | Create country | ADMIN |
| GET | `/locations/countries` | List countries | No |
| PUT | `/locations/countries/:id` | Update country | ADMIN |
| DELETE | `/locations/countries/:id` | Delete country | ADMIN |
| POST | `/locations/cities` | Create city | ADMIN |
| GET | `/locations/cities` | List cities (filter by countryId) | No |
| PUT | `/locations/cities/:id` | Update city | ADMIN |
| DELETE | `/locations/cities/:id` | Delete city | ADMIN |
| POST | `/locations/neighborhoods` | Create neighborhood | ADMIN |
| GET | `/locations/neighborhoods` | List neighborhoods (filter by cityId) | No |
| PUT | `/locations/neighborhoods/:id` | Update neighborhood | ADMIN |
| DELETE | `/locations/neighborhoods/:id` | Delete neighborhood | ADMIN |

### Seed

| Method | Endpoint | Description |
|---|---|---|
| GET | `/seed` | Seed users and organizations |
| GET | `/seed/properties` | Seed locations + properties |
| GET | `/seed/all` | Seed everything |

## Property Filters

`GET /properties` supports the following query parameters:

| Parameter | Type | Description |
|---|---|---|
| `propertyType` | enum | HOUSE, APARTMENT, LAND, COMMERCIAL, OFFICE, WAREHOUSE, GARAGE, BUILDING, COUNTRY_HOUSE, FARM, STUDIO, PENTHOUSE, DUPLEX, TRIPLEX, LOFT, OTHER |
| `transactionType` | enum | SALE, RENT, TEMPORARY_RENT |
| `status` | enum | DRAFT, ACTIVE, PAUSED, SOLD, RENTED, RESERVED, INACTIVE |
| `currency` | enum | USD, VES, ARS, EUR, BRL, CLP, COP, MXN, PEN, UYU |
| `minPrice` / `maxPrice` | number | Price range filter |
| `countryId` | uuid | Filter by country |
| `cityId` | uuid | Filter by city |
| `neighborhoodId` | uuid | Filter by neighborhood |
| `bedrooms` | number | Minimum bedrooms |
| `bathrooms` | number | Minimum bathrooms |
| `minTotalArea` / `maxTotalArea` | number | Total area range (m²) |
| `isFeatured` | boolean | Featured properties only |
| `isPublished` | boolean | Published properties only |
| `search` | string | Text search in title, description, address |
| `sortBy` | string | price, title, bedrooms, totalArea, viewCount, publishedAt, createdAt |
| `sortOrder` | asc/desc | Sort direction |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |

## AI-Powered Search

`POST /properties/ai-search` accepts natural language queries and uses OpenAI to parse them into structured filters.

**Request:**

```json
{
  "query": "Quiero un apartamento en Equipetrol, 2 habitaciones, menos de 100mil dólares",
  "page": 1,
  "limit": 20
}
```

**Response:**

```json
{
  "originalQuery": "Quiero un apartamento en Equipetrol, 2 habitaciones, menos de 100mil dólares",
  "parsedFilters": {
    "propertyType": "APARTMENT",
    "neighborhoodId": "uuid-of-equipetrol",
    "bedrooms": 2,
    "maxPrice": 100000,
    "currency": "USD",
    "transactionType": "SALE"
  },
  "data": [...],
  "total": 3,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

**How it works:**

1. Loads available locations (countries, cities, neighborhoods) from the database
2. Sends the user query + location context to OpenAI using function calling
3. OpenAI returns structured filters (with real UUIDs for locations)
4. The existing property search pipeline handles the query
5. Returns results + the parsed filters for frontend transparency

**Supported natural language patterns:**

- `"apartamento en Las Mercedes con piscina"` → propertyType: APARTMENT, neighborhoodId: uuid
- `"casa menos de 200mil"` → propertyType: HOUSE, maxPrice: 200000, currency: USD
- `"alquiler en Santa Cruz, 3 cuartos"` → transactionType: RENT, cityId: uuid, bedrooms: 3
- `"terreno grande entre 50 y 100 mil"` → propertyType: LAND, minPrice: 50000, maxPrice: 100000
- `"lo más barato en Palermo"` → neighborhoodId: uuid, sortBy: price, sortOrder: asc

> **Note:** Requires `OPENAI_API_KEY` in `.env`. Uses `gpt-4o-mini` by default (~$0.15/1M tokens).

## Multi-Currency Pricing

Properties support multiple prices in different currencies:

- Each property has a **main price** (denormalized in the `property` table for fast filtering)
- Additional prices stored in `property_price` table
- Supported currencies: USD, VES, ARS, EUR, BRL, CLP, COP, MXN, PEN, UYU
- Unique constraint: one price per currency per property

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

## User Roles

- **SUPER_USER** - Super admin access (cross-organization)
- **ADMIN** - Full access within organization
- **USER** - Limited access (create/edit own properties)

## Multi-Tenant Architecture

- Each **Organization** is an isolated tenant (inmobiliaria)
- **Users** belong to an organization
- **Properties** are scoped by `organizationId`
- Each organization gets its own property portal

## Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** JWT + Passport
- **AI:** OpenAI (gpt-4o-mini)
- **Validation:** class-validator + class-transformer
- **Documentation:** Swagger/OpenAPI
- **Storage:** AWS S3
- **Logging:** Winston

## Project Structure

```
src/
├── domain/                          # Business logic
│   ├── common/                      #   Shared interfaces (AI parser)
│   ├── user/                        #   User entity, roles, repository
│   ├── organization/                #   Organization entity, repository
│   ├── property/                    #   Property, PropertyImage, PropertyPrice
│   │   ├── entities/                #     Domain entities
│   │   ├── value-objects/           #     Enums (PropertyType, Currency, etc.)
│   │   └── repositories/           #     Repository interfaces
│   └── location/                    #   Country, City, Neighborhood
│       ├── entities/
│       └── repositories/
├── application/                     # Use cases & DTOs
│   ├── user/
│   ├── organization/
│   ├── property/
│   │   ├── dto/                     #     CreateProperty, FilterProperties, AiSearch
│   │   └── use-cases/               #     CRUD, AI search, seed
│   └── location/
│       ├── dto/
│       └── use-cases/
├── infrastructure/                  # External implementations
│   ├── persistence/
│   │   ├── drizzle/
│   │   │   ├── schema/              #     DB schemas (property, locations, etc.)
│   │   │   └── mappers/             #     Schema ↔ Entity mappers
│   │   └── repositories/           #     Drizzle repository implementations
│   ├── ai/
│   │   └── openai/                  #     OpenAI service + module
│   ├── auth/
│   └── errors/
└── interface/                       # HTTP layer
    └── http/
        ├── auth/
        ├── users/
        ├── organizations/
        ├── properties/              #     Properties controller + module
        ├── locations/               #     Locations controller + module
        ├── seed/                    #     Seed controller + module
        └── common/                  #     Guards, decorators
```

See [CLEAN_ARCHITECTURE.md](./CLEAN_ARCHITECTURE.md) for detailed architecture documentation.
