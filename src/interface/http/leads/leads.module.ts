import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { LeadsController } from './leads.controller';

import { CreateLeadUseCase } from '@application/lead/use-cases/create-lead.use-case';
import { GetLeadsUseCase } from '@application/lead/use-cases/get-leads.use-case';
import { GetLeadUseCase } from '@application/lead/use-cases/get-lead.use-case';
import { UpdateLeadUseCase } from '@application/lead/use-cases/update-lead.use-case';
import { AdvanceLeadStatusUseCase } from '@application/lead/use-cases/advance-lead-status.use-case';
import { AssignLeadUseCase } from '@application/lead/use-cases/assign-lead.use-case';
import { GetLeadHistoryUseCase } from '@application/lead/use-cases/get-lead-history.use-case';

import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzleLeadRepository } from '@infrastructure/persistence/repositories/lead.repository.impl';
import { DrizzleLeadStatusHistoryRepository } from '@infrastructure/persistence/repositories/lead-status-history.repository.impl';
import { DrizzleReservationIntentRepository } from '@infrastructure/persistence/repositories/reservation-intent.repository.impl';

import { LEAD_REPOSITORY } from '@domain/lead/repositories/lead.repository';
import { LEAD_STATUS_HISTORY_REPOSITORY } from '@domain/lead/repositories/lead-status-history.repository';
import { RESERVATION_INTENT_REPOSITORY } from '@domain/intent/repositories/reservation-intent.repository';

import { UsersModule } from '../users/users.module';
import { DevelopersModule } from '../developers/developers.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DrizzleModule,
    UsersModule,
    DevelopersModule,
  ],
  controllers: [LeadsController],
  providers: [
    CreateLeadUseCase,
    GetLeadsUseCase,
    GetLeadUseCase,
    UpdateLeadUseCase,
    AdvanceLeadStatusUseCase,
    AssignLeadUseCase,
    GetLeadHistoryUseCase,
    { provide: LEAD_REPOSITORY, useClass: DrizzleLeadRepository },
    {
      provide: LEAD_STATUS_HISTORY_REPOSITORY,
      useClass: DrizzleLeadStatusHistoryRepository,
    },
    {
      provide: RESERVATION_INTENT_REPOSITORY,
      useClass: DrizzleReservationIntentRepository,
    },
  ],
  exports: [LEAD_REPOSITORY, LEAD_STATUS_HISTORY_REPOSITORY],
})
export class LeadsModule {}
