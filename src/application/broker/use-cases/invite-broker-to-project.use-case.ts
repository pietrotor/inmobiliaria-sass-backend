import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  BROKER_REPOSITORY,
  BrokerRepository,
} from '@domain/broker/repositories/broker.repository';
import {
  BROKER_PROJECT_ACCESS_REPOSITORY,
  BrokerProjectAccessRepository,
} from '@domain/broker/repositories/broker-project-access.repository';
import { BrokerAccessStatus } from '@domain/broker/value-objects/broker-access-status.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class InviteBrokerToProjectUseCase {
  constructor(
    @Inject(BROKER_REPOSITORY)
    private readonly brokerRepository: BrokerRepository,
    @Inject(BROKER_PROJECT_ACCESS_REPOSITORY)
    private readonly accessRepository: BrokerProjectAccessRepository,
  ) {}

  async execute(brokerId: string, projectId: string) {
    try {
      const broker = await this.brokerRepository.findById(brokerId);
      if (!broker) throw new NotFoundException('Broker not found');

      const existing = await this.accessRepository.findByBrokerAndProject(
        brokerId,
        projectId,
      );
      if (existing)
        throw new BadRequestException(
          'Broker already has access to this project',
        );

      return await this.accessRepository.create({
        brokerId,
        projectId,
        status: BrokerAccessStatus.INVITED,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'InviteBrokerToProjectUseCase');
    }
  }
}
