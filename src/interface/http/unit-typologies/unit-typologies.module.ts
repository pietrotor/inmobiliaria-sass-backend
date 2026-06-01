import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UnitTypologiesController } from './unit-typologies.controller';

import { CreateUnitTypologyUseCase } from '@application/unit-typology/use-cases/create-unit-typology.use-case';
import { GetUnitTypologiesUseCase } from '@application/unit-typology/use-cases/get-unit-typologies.use-case';
import { UpdateUnitTypologyUseCase } from '@application/unit-typology/use-cases/update-unit-typology.use-case';
import { DeleteUnitTypologyUseCase } from '@application/unit-typology/use-cases/delete-unit-typology.use-case';

import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzleUnitTypologyRepository } from '@infrastructure/persistence/repositories/unit-typology.repository.impl';

import { UNIT_TYPOLOGY_REPOSITORY } from '@domain/unit-typology/repositories/unit-typology.repository';

import { UsersModule } from '../users/users.module';
import { DevelopersModule } from '../developers/developers.module';
import { ProjectsModule } from '../projects/projects.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DrizzleModule,
    UsersModule,
    DevelopersModule,
    ProjectsModule,
    MediaModule,
  ],
  controllers: [UnitTypologiesController],
  providers: [
    CreateUnitTypologyUseCase,
    GetUnitTypologiesUseCase,
    UpdateUnitTypologyUseCase,
    DeleteUnitTypologyUseCase,

    {
      provide: UNIT_TYPOLOGY_REPOSITORY,
      useClass: DrizzleUnitTypologyRepository,
    },
  ],
  exports: [UNIT_TYPOLOGY_REPOSITORY],
})
export class UnitTypologiesModule {}
