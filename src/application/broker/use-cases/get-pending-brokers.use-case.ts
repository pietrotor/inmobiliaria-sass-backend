import { Inject, Injectable, HttpException } from '@nestjs/common';
import {
  BROKER_REPOSITORY,
  BrokerRepository,
} from '@domain/broker/repositories/broker.repository';
import { BrokerStatus } from '@domain/broker/value-objects/broker-status.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetPendingBrokersUseCase {
  constructor(
    @Inject(BROKER_REPOSITORY)
    private readonly brokerRepository: BrokerRepository,
  ) {}

  async execute() {
    try {
      return await this.brokerRepository.findByStatus(BrokerStatus.PENDING);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'GetPendingBrokersUseCase');
    }
  }
}
