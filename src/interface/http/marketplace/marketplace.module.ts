import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { MarketplaceController } from './marketplace.controller';

import { GenerateProposalUseCase } from '@application/proposal/use-cases/generate-proposal.use-case';
import { DeclareIntentUseCase } from '@application/intent/use-cases/declare-intent.use-case';
import { ApproveIntentUseCase } from '@application/intent/use-cases/approve-intent.use-case';
import { RejectIntentUseCase } from '@application/intent/use-cases/reject-intent.use-case';
import { CancelIntentUseCase } from '@application/intent/use-cases/cancel-intent.use-case';
import { GetIntentsByProjectUseCase } from '@application/intent/use-cases/get-intents-by-project.use-case';
import { JoinWaitlistUseCase } from '@application/intent/use-cases/join-waitlist.use-case';

import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzleCommercialProposalRepository } from '@infrastructure/persistence/repositories/commercial-proposal.repository.impl';
import { DrizzleReservationIntentRepository } from '@infrastructure/persistence/repositories/reservation-intent.repository.impl';
import { DrizzleWaitlistRepository } from '@infrastructure/persistence/repositories/waitlist.repository.impl';

import { COMMERCIAL_PROPOSAL_REPOSITORY } from '@domain/proposal/repositories/commercial-proposal.repository';
import { RESERVATION_INTENT_REPOSITORY } from '@domain/intent/repositories/reservation-intent.repository';
import { WAITLIST_REPOSITORY } from '@domain/intent/repositories/waitlist.repository';

import { UsersModule } from '../users/users.module';
import { BrokersModule } from '../brokers/brokers.module';
import { ProjectsModule } from '../projects/projects.module';
import { UnitsModule } from '../units/units.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DrizzleModule,
    UsersModule,
    BrokersModule,
    ProjectsModule,
    UnitsModule,
  ],
  controllers: [MarketplaceController],
  providers: [
    GenerateProposalUseCase,
    DeclareIntentUseCase,
    ApproveIntentUseCase,
    RejectIntentUseCase,
    CancelIntentUseCase,
    GetIntentsByProjectUseCase,
    JoinWaitlistUseCase,
    {
      provide: COMMERCIAL_PROPOSAL_REPOSITORY,
      useClass: DrizzleCommercialProposalRepository,
    },
    {
      provide: RESERVATION_INTENT_REPOSITORY,
      useClass: DrizzleReservationIntentRepository,
    },
    {
      provide: WAITLIST_REPOSITORY,
      useClass: DrizzleWaitlistRepository,
    },
  ],
  exports: [
    RESERVATION_INTENT_REPOSITORY,
    WAITLIST_REPOSITORY,
    COMMERCIAL_PROPOSAL_REPOSITORY,
  ],
})
export class MarketplaceModule {}
