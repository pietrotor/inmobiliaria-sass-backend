import { Module } from '@nestjs/common';

// Controllers
import { PropertiesController } from './properties.controller';

// Use Cases
import { CreatePropertyUseCase } from '@application/property/use-cases/create-property.use-case';
import { GetPropertyUseCase } from '@application/property/use-cases/get-property.use-case';
import { GetPropertiesUseCase } from '@application/property/use-cases/get-properties.use-case';
import { UpdatePropertyUseCase } from '@application/property/use-cases/update-property.use-case';
import { DeletePropertyUseCase } from '@application/property/use-cases/delete-property.use-case';
import { AddPropertyImageUseCase } from '@application/property/use-cases/add-property-image.use-case';
import { DeletePropertyImageUseCase } from '@application/property/use-cases/delete-property-image.use-case';

// Infrastructure
import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzlePropertyRepository } from '@infrastructure/persistence/repositories/property.repository.impl';
import { DrizzlePropertyImageRepository } from '@infrastructure/persistence/repositories/property-image.repository.impl';

// Domain
import { PROPERTY_REPOSITORY } from '@domain/property/repositories/property.repository';
import { PROPERTY_IMAGE_REPOSITORY } from '@domain/property/repositories/property-image.repository';

// Import UsersModule for authentication
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DrizzleModule, UsersModule],
  controllers: [PropertiesController],
  providers: [
    // Use Cases
    CreatePropertyUseCase,
    GetPropertyUseCase,
    GetPropertiesUseCase,
    UpdatePropertyUseCase,
    DeletePropertyUseCase,
    AddPropertyImageUseCase,
    DeletePropertyImageUseCase,

    // Repository Implementations
    {
      provide: PROPERTY_REPOSITORY,
      useClass: DrizzlePropertyRepository,
    },
    {
      provide: PROPERTY_IMAGE_REPOSITORY,
      useClass: DrizzlePropertyImageRepository,
    },
  ],
  exports: [PROPERTY_REPOSITORY, PROPERTY_IMAGE_REPOSITORY],
})
export class PropertiesModule {}
