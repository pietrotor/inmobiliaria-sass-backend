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
import { BrokerStatus } from '@domain/broker/value-objects/broker-status.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class SuspendBrokerUseCase {
  constructor(
    @Inject(BROKER_REPOSITORY)
    private readonly brokerRepository: BrokerRepository,
  ) {}

  async execute(brokerId: string) {
    try {
      const broker = await this.brokerRepository.findById(brokerId);
      if (!broker) throw new NotFoundException('Broker not found');

      return await this.brokerRepository.update(brokerId, {
        status: BrokerStatus.SUSPENDED,
      } as any);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'SuspendBrokerUseCase');
    }
  }
}
