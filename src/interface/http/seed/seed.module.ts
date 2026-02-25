import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';

import { SeedUsersUseCase } from '@application/user/use-cases/seed-users.use-case';

import { UsersModule } from '../users/users.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { LocationsModule } from '../locations/locations.module';
import { DevelopersModule } from '../developers/developers.module';
import { ProjectsModule } from '../projects/projects.module';
import { MediaModule } from '../media/media.module';
import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';

@Module({
  imports: [
    DrizzleModule,
    UsersModule,
    OrganizationsModule,
    LocationsModule,
    DevelopersModule,
    ProjectsModule,
    MediaModule,
  ],
  controllers: [SeedController],
  providers: [SeedUsersUseCase],
})
export class SeedModule {}
