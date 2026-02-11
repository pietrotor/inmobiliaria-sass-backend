# Clean Architecture Lite - Guia de Implementacion

Este proyecto implementa **Clean Architecture Lite** sin CQRS ni eventos, manteniendo la simplicidad pero con una clara separacion de responsabilidades.

## Estructura de Capas

```
src/
├── domain/                    # Capa de Dominio (nucleo puro)
│   ├── user/
│   │   ├── entities/         # Entidades de negocio con logica
│   │   ├── repositories/     # Interfaces (contratos/puertos)
│   │   └── value-objects/    # Enums, tipos y objetos de valor
│   ├── organization/
│   │   ├── entities/
│   │   └── repositories/
│   └── common/
│       └── exceptions/       # Excepciones de dominio
│
├── application/              # Capa de Aplicacion (casos de uso)
│   ├── user/
│   │   ├── use-cases/       # Logica de aplicacion
│   │   └── dto/             # DTOs de entrada/salida
│   ├── organization/
│   │   ├── use-cases/
│   │   └── dto/
│   └── common/
│       └── dto/             # DTOs compartidos
│
├── infrastructure/           # Capa de Infraestructura (adaptadores)
│   ├── persistence/
│   │   ├── drizzle/
│   │   │   ├── schema/      # Schemas de base de datos
│   │   │   ├── mappers/     # Conversion Schema <-> Entity
│   │   │   └── drizzle.service.ts
│   │   └── repositories/    # Implementaciones de repositorios
│   ├── auth/
│   │   ├── bcrypt/          # Servicio de encriptacion
│   │   └── jwt/             # Estrategia JWT y payload
│   ├── storage/
│   │   └── s3/              # Servicio de almacenamiento S3
│   └── config/
│
└── interface/                # Capa de Interfaz (controllers)
    └── http/
        ├── users/
        │   ├── users.controller.ts
        │   ├── users.module.ts
        │   ├── guards/      # Guards de autenticacion
        │   └── decorators/  # Decoradores personalizados
        ├── organizations/
        └── seed/
```

## Regla de Dependencia

```
Interface -> Application -> Domain
       \  Infrastructure /
```

- **Domain**: No depende de nadie (nucleo puro)
- **Application**: Solo depende de Domain
- **Infrastructure**: Implementa contratos de Domain
- **Interface**: Coordina todo usando Application

## Path Aliases (Importaciones Limpias)

El proyecto usa **path aliases** de TypeScript para evitar importaciones relativas largas:

```typescript
// Antes (confuso y dificil de mantener)
import { User } from '../../../../domain/user/entities/user.entity';
import { UserRepository } from '../../../domain/user/repositories/user.repository';

// Ahora (limpio y claro)
import { User } from '@domain/user/entities/user.entity';
import { UserRepository } from '@domain/user/repositories/user.repository';
```

### Aliases Configurados

| Alias | Ruta | Uso |
|-------|------|-----|
| `@domain/*` | `src/domain/*` | Entidades, repositorios (interfaces), value objects |
| `@application/*` | `src/application/*` | Use cases, DTOs |
| `@infrastructure/*` | `src/infrastructure/*` | Implementaciones de repositorios, servicios |
| `@interface/*` | `src/interface/*` | Controllers, guards, decorators |

### Ejemplos de Uso

```typescript
// En Infrastructure (implementacion de repositorio)
import { User } from '@domain/user/entities/user.entity';
import { UserRepository } from '@domain/user/repositories/user.repository';

// En Application (use case)
import { UserRepository, USER_REPOSITORY } from '@domain/user/repositories/user.repository';
import { BcryptService } from '@infrastructure/auth/bcrypt/bcrypt.service';
import { CreateUserDto } from '@application/user/dto/create-user.dto';

// En Interface (controller)
import { CreateUserUseCase } from '@application/user/use-cases/create-user.use-case';
import { User } from '@domain/user/entities/user.entity';
import { Role } from '@domain/user/value-objects/role.vo';
```

## Capas Explicadas

### 1. Domain Layer (Dominio)

**Responsabilidad**: Contiene la logica de negocio pura y las reglas del dominio.

#### Entidades (`entities/`)
```typescript
// src/domain/user/entities/user.entity.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    // ...mas campos
  ) {}

  // Metodos de logica de negocio
  hasRole(role: Role): boolean {
    return this.roles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole(Role.ADMIN);
  }
}
```

#### Repositorios - Interfaces (`repositories/`)
```typescript
// src/domain/user/repositories/user.repository.ts
export interface UserRepository {
  create(user: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  // ...mas metodos
}

export const USER_REPOSITORY = 'UserRepository'; // Token de inyeccion
```

#### Value Objects (`value-objects/`)
```typescript
// src/domain/user/value-objects/role.vo.ts
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_USER = 'SUPER_USER',
}
```

### 2. Application Layer (Aplicacion)

**Responsabilidad**: Coordina la logica de aplicacion (casos de uso).

#### Use Cases (`use-cases/`)
```typescript
// src/application/user/use-cases/create-user.use-case.ts
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: CreateUserDto) {
    // Logica del caso de uso
    const hashedPassword = this.bcryptService.hashSync(dto.password);
    const user = await this.userRepository.create({...});
    return { ...user, token: this.jwtService.sign({...}) };
  }
}
```

#### DTOs (`dto/`)
```typescript
// src/application/user/dto/create-user.dto.ts
export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  // ...mas validaciones
}
```

### 3. Infrastructure Layer (Infraestructura)

**Responsabilidad**: Implementa los contratos del dominio con tecnologias especificas.

#### Mappers (`mappers/`)
```typescript
// src/infrastructure/persistence/drizzle/mappers/user.mapper.ts
export class UserMapper {
  static toDomain(schema: UserSchema): User {
    return new User(
      schema.id,
      schema.name,
      // ...
    );
  }

  static toPersistence(domain: User) {
    return {
      id: domain.id,
      name: domain.name,
      // ...
    };
  }
}
```

#### Repository Implementation (`repositories/`)
```typescript
// src/infrastructure/persistence/repositories/user.repository.impl.ts
@Injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(user: CreateUserData): Promise<User> {
    const [created] = await this.drizzle.db
      .insert(users)
      .values({...})
      .returning();

    return UserMapper.toDomain(created);
  }
}
```

### 4. Interface Layer (Interfaz)

**Responsabilidad**: Expone la funcionalidad a traves de HTTP (controllers).

#### Controllers (`controllers/`)
```typescript
// src/interface/http/users/users.controller.ts
@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  createUser(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }
}
```

## Inyeccion de Dependencias

La inyeccion de dependencias se configura en los modulos de NestJS:

```typescript
// src/interface/http/users/users.module.ts
@Module({
  imports: [DrizzleModule, JwtModule, PassportModule],
  controllers: [AuthController],
  providers: [
    // Use Cases
    CreateUserUseCase,
    LoginUserUseCase,

    // Infrastructure Services
    BcryptService,
    JwtStrategy,

    // Repository Implementation (DI)
    {
      provide: USER_REPOSITORY,      // Token del dominio
      useClass: DrizzleUserRepository, // Implementacion de infrastructure
    },
  ],
  exports: [USER_REPOSITORY], // Para otros modulos
})
export class UsersModule {}
```

## Como Agregar una Nueva Funcionalidad

### Ejemplo: Agregar "Products"

#### 1. **Domain Layer**
```bash
mkdir -p src/domain/product/{entities,repositories,value-objects}
```

```typescript
// src/domain/product/entities/product.entity.ts
export class Product {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly name: string,
    public readonly price: number,
  ) {}

  isExpensive(): boolean {
    return this.price > 1000;
  }
}

// src/domain/product/repositories/product.repository.ts
export interface ProductRepository {
  create(data: CreateProductData): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findByOrganizationId(organizationId: string): Promise<Product[]>;
}

export const PRODUCT_REPOSITORY = 'ProductRepository';
```

#### 2. **Infrastructure Layer**
```typescript
// src/infrastructure/persistence/drizzle/schema/product.schema.ts
export const products = pgTable('product', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  price: doublePrecision('price').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// src/infrastructure/persistence/drizzle/mappers/product.mapper.ts
export class ProductMapper {
  static toDomain(schema: ProductSchema): Product {
    return new Product(
      schema.id,
      schema.organizationId,
      schema.name,
      schema.price,
    );
  }
}

// src/infrastructure/persistence/repositories/product.repository.impl.ts
@Injectable()
export class DrizzleProductRepository implements ProductRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateProductData): Promise<Product> {
    const [created] = await this.drizzle.db
      .insert(products)
      .values(data)
      .returning();
    return ProductMapper.toDomain(created);
  }
}
```

#### 3. **Application Layer**
```typescript
// src/application/product/use-cases/create-product.use-case.ts
@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(dto: CreateProductDto) {
    const product = await this.productRepository.create({
      organizationId: dto.organizationId,
      name: dto.name,
      price: dto.price,
    });
    return product;
  }
}

// src/application/product/dto/create-product.dto.ts
export class CreateProductDto {
  @IsUUID()
  organizationId: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}
```

#### 4. **Interface Layer**
```typescript
// src/interface/http/products/products.controller.ts
@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  @Post()
  @Auth()
  createProduct(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(dto);
  }
}

// src/interface/http/products/products.module.ts
@Module({
  imports: [DrizzleModule],
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: DrizzleProductRepository,
    },
  ],
})
export class ProductsModule {}
```

## Ventajas de Esta Arquitectura

1. **Testeable**: Mockear repositorios es trivial
2. **Mantenible**: Cada capa tiene responsabilidad unica
3. **Escalable**: Facil agregar nuevos casos de uso
4. **Agnostico**: Cambiar Drizzle por TypeORM solo afecta infrastructure
5. **MVP-friendly**: Sin CQRS, eventos ni complejidad extra
6. **Separacion clara**: Logica de negocio independiente de frameworks

## Testing

### Unit Tests (Use Cases)
```typescript
describe('CreateUserUseCase', () => {
  it('should create a user', async () => {
    const mockRepository: UserRepository = {
      create: jest.fn().mockResolvedValue(mockUser),
    };

    const useCase = new CreateUserUseCase(
      mockRepository,
      mockBcryptService,
      mockJwtService,
    );

    const result = await useCase.execute(createUserDto);
    expect(result).toBeDefined();
  });
});
```

### Integration Tests (Controllers)
```typescript
describe('AuthController (e2e)', () => {
  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(createUserDto)
      .expect(201);
  });
});
```

## Proximos Pasos

1. **Agregar mas modulos** siguiendo el mismo patron
2. **Implementar testing** para use cases y controllers
3. **Agregar validaciones** de dominio en las entidades
4. **Documentar APIs** con Swagger
5. **Implementar logging** y monitoring

## Recursos

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)

---

**Nota**: Esta arquitectura esta disenada para ser simple pero escalable. No uses CQRS ni eventos a menos que realmente los necesites. Manten el MVP simple y evoluciona cuando sea necesario.
