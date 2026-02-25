import { Module } from '@nestjs/common';

// Controllers
import { SeedController } from './seed.controller';

// Use Cases
import { SeedUsersUseCase } from '@application/user/use-cases/seed-users.use-case';
import { SeedPropertiesUseCase } from '@application/property/use-cases/seed-properties.use-case';

// Modules
import { UsersModule } from '../users/users.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { LocationsModule } from '../locations/locations.module';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [UsersModule, OrganizationsModule, LocationsModule, PropertiesModule],
  controllers: [SeedController],
  providers: [SeedUsersUseCase, SeedPropertiesUseCase],
})
export class SeedModule {}
