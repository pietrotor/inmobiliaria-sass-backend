import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { BuildingsController } from './buildings.controller';

import { CreateBuildingUseCase } from '@application/building/use-cases/create-building.use-case';
import { GetBuildingsUseCase } from '@application/building/use-cases/get-buildings.use-case';
import { UpdateBuildingUseCase } from '@application/building/use-cases/update-building.use-case';
import { DeleteBuildingUseCase } from '@application/building/use-cases/delete-building.use-case';

import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzleBuildingRepository } from '@infrastructure/persistence/repositories/building.repository.impl';

import { BUILDING_REPOSITORY } from '@domain/building/repositories/building.repository';

import { UsersModule } from '../users/users.module';
import { DevelopersModule } from '../developers/developers.module';
import { ProjectsModule } from '../projects/projects.module';
import { UnitsModule } from '../units/units.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DrizzleModule,
    UsersModule,
    DevelopersModule,
    ProjectsModule,
    forwardRef(() => UnitsModule),
  ],
  controllers: [BuildingsController],
  providers: [
    CreateBuildingUseCase,
    GetBuildingsUseCase,
    UpdateBuildingUseCase,
    DeleteBuildingUseCase,

    {
      provide: BUILDING_REPOSITORY,
      useClass: DrizzleBuildingRepository,
    },
  ],
  exports: [BUILDING_REPOSITORY],
})
export class BuildingsModule {}
