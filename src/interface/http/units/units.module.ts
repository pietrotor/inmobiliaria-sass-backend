import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UnitsController } from './units.controller';

import { CreateUnitUseCase } from '@application/unit/use-cases/create-unit.use-case';
import { GetUnitUseCase } from '@application/unit/use-cases/get-unit.use-case';
import { GetUnitsByProjectUseCase } from '@application/unit/use-cases/get-units-by-project.use-case';
import { UpdateUnitUseCase } from '@application/unit/use-cases/update-unit.use-case';
import { ChangeUnitStatusUseCase } from '@application/unit/use-cases/change-unit-status.use-case';
import { GetUnitPriceHistoryUseCase } from '@application/unit/use-cases/get-unit-price-history.use-case';
import { DeleteUnitUseCase } from '@application/unit/use-cases/delete-unit.use-case';
import { UploadUnitMediaUseCase } from '@application/unit/use-cases/upload-unit-media.use-case';
import { DeleteUnitMediaUseCase } from '@application/unit/use-cases/delete-unit-media.use-case';
import { UpdateUnitPriceUseCase } from '@application/unit/use-cases/update-unit-price.use-case';

import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzleUnitRepository } from '@infrastructure/persistence/repositories/unit.repository.impl';
import { DrizzleUnitPriceHistoryRepository } from '@infrastructure/persistence/repositories/unit-price-history.repository.impl';

import { UNIT_REPOSITORY } from '@domain/unit/repositories/unit.repository';
import { UNIT_PRICE_HISTORY_REPOSITORY } from '@domain/unit/repositories/unit-price-history.repository';

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
  controllers: [UnitsController],
  providers: [
    CreateUnitUseCase,
    GetUnitUseCase,
    GetUnitsByProjectUseCase,
    UpdateUnitUseCase,
    ChangeUnitStatusUseCase,
    GetUnitPriceHistoryUseCase,
    DeleteUnitUseCase,
    UpdateUnitPriceUseCase,
    UploadUnitMediaUseCase,
    DeleteUnitMediaUseCase,

    {
      provide: UNIT_REPOSITORY,
      useClass: DrizzleUnitRepository,
    },
    {
      provide: UNIT_PRICE_HISTORY_REPOSITORY,
      useClass: DrizzleUnitPriceHistoryRepository,
    },
  ],
  exports: [UNIT_REPOSITORY, UNIT_PRICE_HISTORY_REPOSITORY],
})
export class UnitsModule {}
