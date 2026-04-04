import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  BROKER_PROJECT_ACCESS_REPOSITORY,
  BrokerProjectAccessRepository,
} from '@domain/broker/repositories/broker-project-access.repository';
import {
  RESERVATION_INTENT_REPOSITORY,
  ReservationIntentRepository,
} from '@domain/intent/repositories/reservation-intent.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class RevokeBrokerAccessUseCase {
  constructor(
    @Inject(BROKER_PROJECT_ACCESS_REPOSITORY)
    private readonly accessRepository: BrokerProjectAccessRepository,
    @Inject(RESERVATION_INTENT_REPOSITORY)
    private readonly intentRepository: ReservationIntentRepository,
  ) {}

  async execute(brokerId: string, projectId: string) {
    try {
      const access = await this.accessRepository.findByBrokerAndProject(
        brokerId,
        projectId,
      );
      if (!access)
        throw new NotFoundException(
          'Broker access not found for this project',
        );

      const activeIntents =
        await this.intentRepository.findActiveByBrokerId(brokerId);
      const blockingIntent = activeIntents.find(
        (i) => i.projectId === projectId,
      );
      if (blockingIntent) {
        throw new BadRequestException(
          `Cannot revoke access: broker has an active intent (${blockingIntent.id}) in this project`,
        );
      }

      await this.accessRepository.delete(access.id);
      return { message: 'Broker access revoked successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'RevokeBrokerAccessUseCase');
    }
  }
}
