import { Module } from '@nestjs/common';

// Controllers
import { SeedController } from './seed.controller';

// Use Cases
import { SeedUsersUseCase } from '@application/user/use-cases/seed-users.use-case';

// Modules
import { UsersModule } from '../users/users.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [UsersModule, OrganizationsModule, LocationsModule],
  controllers: [SeedController],
  providers: [SeedUsersUseCase],
})
export class SeedModule {}
