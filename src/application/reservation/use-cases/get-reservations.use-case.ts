import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import {
  RESERVATION_REPOSITORY,
  ReservationFilters,
  ReservationRepository,
} from '@domain/reservation/repositories/reservation.repository';
import {
  DEVELOPER_REPOSITORY,
  DeveloperRepository,
} from '@domain/developer/repositories/developer.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetReservationsUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepo: ReservationRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepo: DeveloperRepository,
  ) {}

  async execute(
    organizationId: string,
    limit: number,
    offset: number,
    filters?: ReservationFilters,
  ) {
    try {
      const developer =
        await this.developerRepo.findByOrganizationId(organizationId);
      if (!developer) throw new NotFoundException('Developer not found');
      return await this.reservationRepo.findByDeveloperId(
        developer.id,
        limit,
        offset,
        filters,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'GetReservationsUseCase');
    }
  }
}
