import { Module } from '@nestjs/common';

// Controllers
import { DevelopersController } from './developers.controller';

// Use Cases
import { CreateDeveloperUseCase } from '@application/developer/use-cases/create-developer.use-case';
import { GetDeveloperUseCase } from '@application/developer/use-cases/get-developer.use-case';
import { GetDeveloperByOrganizationUseCase } from '@application/developer/use-cases/get-developer-by-organization.use-case';
import { UpdateDeveloperUseCase } from '@application/developer/use-cases/update-developer.use-case';
import { DeleteDeveloperUseCase } from '@application/developer/use-cases/delete-developer.use-case';

// Infrastructure
import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzleDeveloperRepository } from '@infrastructure/persistence/repositories/developer.repository.impl';

// Domain
import { DEVELOPER_REPOSITORY } from '@domain/developer/repositories/developer.repository';

// Import UsersModule for authentication
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DrizzleModule, UsersModule],
  controllers: [DevelopersController],
  providers: [
    // Use Cases
    CreateDeveloperUseCase,
    GetDeveloperUseCase,
    GetDeveloperByOrganizationUseCase,
    UpdateDeveloperUseCase,
    DeleteDeveloperUseCase,

    // Repository Implementation
    {
      provide: DEVELOPER_REPOSITORY,
      useClass: DrizzleDeveloperRepository,
    },
  ],
  exports: [DEVELOPER_REPOSITORY],
})
export class DevelopersModule {}
