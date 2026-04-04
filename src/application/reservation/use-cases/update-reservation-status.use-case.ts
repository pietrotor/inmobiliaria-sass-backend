import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  RESERVATION_REPOSITORY,
  ReservationRepository,
} from '@domain/reservation/repositories/reservation.repository';
import {
  UNIT_REPOSITORY,
  UnitRepository,
} from '@domain/unit/repositories/unit.repository';
import { ReservationStatus } from '@domain/reservation/value-objects/reservation-status.vo';
import { UnitStatus } from '@domain/unit/value-objects/unit-status.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpdateReservationStatusUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepo: ReservationRepository,
    @Inject(UNIT_REPOSITORY)
    private readonly unitRepo: UnitRepository,
  ) {}

  async execute(
    reservationId: string,
    status: ReservationStatus,
    extra?: { agreementSignedDate?: string; deliveryDate?: string },
  ) {
    try {
      const reservation = await this.reservationRepo.findById(reservationId);
      if (!reservation)
        throw new NotFoundException('Reservation not found');
      if (!reservation.canTransitionTo(status)) {
        throw new BadRequestException(
          `Cannot transition from ${reservation.status} to ${status}`,
        );
      }

      const updateData: Record<string, any> = { status };

      if (
        status === ReservationStatus.AGREEMENT_SIGNED &&
        extra?.agreementSignedDate
      ) {
        updateData.agreementSignedDate = new Date(extra.agreementSignedDate);
      }

      if (status === ReservationStatus.DELIVERED && extra?.deliveryDate) {
        updateData.deliveryDate = new Date(extra.deliveryDate);
        for (const unitId of reservation.unitIds) {
          await this.unitRepo.update(unitId, {
            status: UnitStatus.SOLD,
          } as any);
        }
      }

      if (status === ReservationStatus.FALLEN) {
        for (const unitId of reservation.unitIds) {
          await this.unitRepo.update(unitId, {
            status: UnitStatus.AVAILABLE,
          } as any);
        }
      }

      return await this.reservationRepo.update(reservationId, updateData);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'UpdateReservationStatusUseCase');
    }
  }
}
