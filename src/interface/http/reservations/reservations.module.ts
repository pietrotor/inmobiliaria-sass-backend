import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ReservationsController } from './reservations.controller';

import { CreateReservationUseCase } from '@application/reservation/use-cases/create-reservation.use-case';
import { GetReservationsUseCase } from '@application/reservation/use-cases/get-reservations.use-case';
import { UpdateReservationStatusUseCase } from '@application/reservation/use-cases/update-reservation-status.use-case';

import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzleReservationRepository } from '@infrastructure/persistence/repositories/reservation.repository.impl';
import { RESERVATION_REPOSITORY } from '@domain/reservation/repositories/reservation.repository';

import { UsersModule } from '../users/users.module';
import { DevelopersModule } from '../developers/developers.module';
import { UnitsModule } from '../units/units.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DrizzleModule,
    UsersModule,
    DevelopersModule,
    UnitsModule,
  ],
  controllers: [ReservationsController],
  providers: [
    CreateReservationUseCase,
    GetReservationsUseCase,
    UpdateReservationStatusUseCase,
    {
      provide: RESERVATION_REPOSITORY,
      useClass: DrizzleReservationRepository,
    },
  ],
  exports: [RESERVATION_REPOSITORY],
})
export class ReservationsModule {}
