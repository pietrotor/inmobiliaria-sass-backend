import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  RESERVATION_INTENT_REPOSITORY,
  ReservationIntentRepository,
} from '@domain/intent/repositories/reservation-intent.repository';
import {
  UNIT_REPOSITORY,
  UnitRepository,
} from '@domain/unit/repositories/unit.repository';
import { IntentStatus } from '@domain/intent/value-objects/intent-status.vo';
import { UnitStatus } from '@domain/unit/value-objects/unit-status.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class CancelIntentUseCase {
  constructor(
    @Inject(RESERVATION_INTENT_REPOSITORY)
    private readonly intentRepo: ReservationIntentRepository,
    @Inject(UNIT_REPOSITORY)
    private readonly unitRepo: UnitRepository,
  ) {}

  async execute(intentId: string, userId: string) {
    try {
      const intent = await this.intentRepo.findById(intentId);
      if (!intent) throw new NotFoundException('Intent not found');
      if (!intent.isActive())
        throw new BadRequestException('Intent is not active');

      await this.intentRepo.update(intentId, {
        status: IntentStatus.CANCELLED,
      } as any);

      for (const unitId of intent.unitIds) {
        await this.unitRepo.update(unitId, {
          status: UnitStatus.AVAILABLE,
        } as any);
      }

      return await this.intentRepo.findById(intentId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'CancelIntentUseCase');
    }
  }
}
