import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { CommissionsController } from './commissions.controller';

import { CreateCommissionUseCase } from '@application/commission/use-cases/create-commission.use-case';
import { MarkCommissionPaidUseCase } from '@application/commission/use-cases/mark-commission-paid.use-case';
import { DisputeCommissionUseCase } from '@application/commission/use-cases/dispute-commission.use-case';
import { GetCommissionsUseCase } from '@application/commission/use-cases/get-commissions.use-case';

import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzleCommissionRepository } from '@infrastructure/persistence/repositories/commission.repository.impl';
import { COMMISSION_REPOSITORY } from '@domain/commission/repositories/commission.repository';

import { UsersModule } from '../users/users.module';
import { DevelopersModule } from '../developers/developers.module';
import { BrokersModule } from '../brokers/brokers.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DrizzleModule,
    UsersModule,
    DevelopersModule,
    BrokersModule,
  ],
  controllers: [CommissionsController],
  providers: [
    CreateCommissionUseCase,
    MarkCommissionPaidUseCase,
    DisputeCommissionUseCase,
    GetCommissionsUseCase,
    {
      provide: COMMISSION_REPOSITORY,
      useClass: DrizzleCommissionRepository,
    },
  ],
  exports: [COMMISSION_REPOSITORY, CreateCommissionUseCase],
})
export class CommissionsModule {}
