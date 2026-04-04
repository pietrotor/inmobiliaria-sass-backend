import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { BrokersController } from './brokers.controller';

import { RegisterBrokerUseCase } from '@application/broker/use-cases/register-broker.use-case';
import { ApproveBrokerUseCase } from '@application/broker/use-cases/approve-broker.use-case';
import { SuspendBrokerUseCase } from '@application/broker/use-cases/suspend-broker.use-case';
import { GetPendingBrokersUseCase } from '@application/broker/use-cases/get-pending-brokers.use-case';
import { GetBrokerProfileUseCase } from '@application/broker/use-cases/get-broker-profile.use-case';
import { UpgradeBrokerPlanUseCase } from '@application/broker/use-cases/upgrade-broker-plan.use-case';
import { InviteBrokerToProjectUseCase } from '@application/broker/use-cases/invite-broker-to-project.use-case';
import { RevokeBrokerAccessUseCase } from '@application/broker/use-cases/revoke-broker-access.use-case';

import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzleBrokerRepository } from '@infrastructure/persistence/repositories/broker.repository.impl';
import { DrizzleBrokerProjectAccessRepository } from '@infrastructure/persistence/repositories/broker-project-access.repository.impl';
import { DrizzleReservationIntentRepository } from '@infrastructure/persistence/repositories/reservation-intent.repository.impl';

import { BROKER_REPOSITORY } from '@domain/broker/repositories/broker.repository';
import { BROKER_PROJECT_ACCESS_REPOSITORY } from '@domain/broker/repositories/broker-project-access.repository';
import { RESERVATION_INTENT_REPOSITORY } from '@domain/intent/repositories/reservation-intent.repository';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DrizzleModule,
    UsersModule,
  ],
  controllers: [BrokersController],
  providers: [
    RegisterBrokerUseCase,
    ApproveBrokerUseCase,
    SuspendBrokerUseCase,
    GetPendingBrokersUseCase,
    GetBrokerProfileUseCase,
    UpgradeBrokerPlanUseCase,
    InviteBrokerToProjectUseCase,
    RevokeBrokerAccessUseCase,
    { provide: BROKER_REPOSITORY, useClass: DrizzleBrokerRepository },
    {
      provide: BROKER_PROJECT_ACCESS_REPOSITORY,
      useClass: DrizzleBrokerProjectAccessRepository,
    },
    {
      provide: RESERVATION_INTENT_REPOSITORY,
      useClass: DrizzleReservationIntentRepository,
    },
  ],
  exports: [BROKER_REPOSITORY, BROKER_PROJECT_ACCESS_REPOSITORY],
})
export class BrokersModule {}
