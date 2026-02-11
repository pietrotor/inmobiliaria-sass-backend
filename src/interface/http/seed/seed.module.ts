import { Module } from '@nestjs/common';

// Controllers
import { SeedController } from './seed.controller';

// Use Cases
import { SeedUsersUseCase } from '@application/user/use-cases/seed-users.use-case';

// Modules
import { UsersModule } from '../users/users.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [UsersModule, OrganizationsModule],
  controllers: [SeedController],
  providers: [SeedUsersUseCase],
})
export class SeedModule {}
