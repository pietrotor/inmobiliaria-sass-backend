import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';

import { SeedUsersUseCase } from '@application/user/use-cases/seed-users.use-case';

import { UsersModule } from '../users/users.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { LocationsModule } from '../locations/locations.module';
import { DevelopersModule } from '../developers/developers.module';
import { ProjectsModule } from '../projects/projects.module';
import { UnitsModule } from '../units/units.module';
import { MediaModule } from '../media/media.module';
import { BuildingsModule } from '../buildings/buildings.module';
import { UnitTypologiesModule } from '../unit-typologies/unit-typologies.module';
import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';

@Module({
  imports: [
    DrizzleModule,
    UsersModule,
    OrganizationsModule,
    LocationsModule,
    DevelopersModule,
    ProjectsModule,
    UnitsModule,
    MediaModule,
    BuildingsModule,
    UnitTypologiesModule,
  ],
  controllers: [SeedController],
  providers: [SeedUsersUseCase],
})
export class SeedModule {}
