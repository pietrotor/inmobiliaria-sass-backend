import { Module } from '@nestjs/common';

// Controllers
import { OrganizationsController } from './organizations.controller';

// Use Cases
import { CreateOrganizationUseCase } from '@application/organization/use-cases/create-organization.use-case';
import { GetOrganizationsUseCase } from '@application/organization/use-cases/get-organizations.use-case';
import { GetOrganizationUseCase } from '@application/organization/use-cases/get-organization.use-case';
import { UpdateOrganizationUseCase } from '@application/organization/use-cases/update-organization.use-case';
import { DeleteOrganizationUseCase } from '@application/organization/use-cases/delete-organization.use-case';

// Infrastructure
import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzleOrganizationRepository } from '@infrastructure/persistence/repositories/organization.repository.impl';

// Domain
import { ORGANIZATION_REPOSITORY } from '@domain/organization/repositories/organization.repository';

// Import UsersModule for authentication
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DrizzleModule, UsersModule],
  controllers: [OrganizationsController],
  providers: [
    // Use Cases
    CreateOrganizationUseCase,
    GetOrganizationsUseCase,
    GetOrganizationUseCase,
    UpdateOrganizationUseCase,
    DeleteOrganizationUseCase,

    // Repository Implementation
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: DrizzleOrganizationRepository,
    },
  ],
  exports: [ORGANIZATION_REPOSITORY],
})
export class OrganizationsModule {}
