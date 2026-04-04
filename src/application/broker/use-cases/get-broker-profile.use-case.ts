import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import {
  BROKER_REPOSITORY,
  BrokerRepository,
} from '@domain/broker/repositories/broker.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetBrokerProfileUseCase {
  constructor(
    @Inject(BROKER_REPOSITORY)
    private readonly brokerRepository: BrokerRepository,
  ) {}

  async execute(userId: string) {
    try {
      const broker = await this.brokerRepository.findByUserId(userId);
      if (!broker) throw new NotFoundException('Broker profile not found');

      const cancellations =
        await this.brokerRepository.countCancellationsLast30Days(broker.id);
      return { ...broker, cancellationsLast30Days: cancellations };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'GetBrokerProfileUseCase');
    }
  }
}
