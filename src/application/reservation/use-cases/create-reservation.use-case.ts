import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import {
  RESERVATION_REPOSITORY,
  ReservationRepository,
} from '@domain/reservation/repositories/reservation.repository';
import {
  DEVELOPER_REPOSITORY,
  DeveloperRepository,
} from '@domain/developer/repositories/developer.repository';
import { ReservationStatus } from '@domain/reservation/value-objects/reservation-status.vo';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepo: ReservationRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepo: DeveloperRepository,
  ) {}

  async execute(organizationId: string, dto: CreateReservationDto) {
    try {
      const developer =
        await this.developerRepo.findByOrganizationId(organizationId);
      if (!developer) throw new NotFoundException('Developer not found');

      return await this.reservationRepo.create({
        unitIds: dto.unitIds,
        clientName: dto.clientName,
        clientNationalId: dto.clientNationalId,
        clientPhone: dto.clientPhone,
        clientEmail: dto.clientEmail,
        salesChannel: dto.salesChannel,
        brokerId: dto.brokerId,
        intentId: dto.intentId,
        executiveId: dto.executiveId,
        developerId: developer.id,
        reservationPaymentAmount: dto.reservationPaymentAmount,
        reservationPaymentCurrency: dto.reservationPaymentCurrency,
        reservationPaymentDate: new Date(dto.reservationPaymentDate),
        agreementDeadline: dto.agreementDeadline
          ? new Date(dto.agreementDeadline)
          : undefined,
        status: ReservationStatus.RESERVED,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'CreateReservationUseCase');
    }
  }
}
