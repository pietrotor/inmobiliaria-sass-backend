import { Inject, Injectable, HttpException } from '@nestjs/common';
import {
  RESERVATION_INTENT_REPOSITORY,
  ReservationIntentRepository,
} from '@domain/intent/repositories/reservation-intent.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetIntentsByProjectUseCase {
  constructor(
    @Inject(RESERVATION_INTENT_REPOSITORY)
    private readonly intentRepo: ReservationIntentRepository,
  ) {}

  async execute(projectId: string, limit: number, offset: number) {
    try {
      return await this.intentRepo.findByProjectId(projectId, limit, offset);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'GetIntentsByProjectUseCase');
    }
  }
}
