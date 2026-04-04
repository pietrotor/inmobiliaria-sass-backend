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
import { BrokerPlan } from '@domain/broker/value-objects/broker-plan.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpgradeBrokerPlanUseCase {
  constructor(
    @Inject(BROKER_REPOSITORY)
    private readonly brokerRepository: BrokerRepository,
  ) {}

  async execute(userId: string) {
    try {
      const broker = await this.brokerRepository.findByUserId(userId);
      if (!broker) throw new NotFoundException('Broker profile not found');
      if (broker.isPro())
        throw new BadRequestException('Broker is already on PRO plan');

      return await this.brokerRepository.update(broker.id, {
        plan: BrokerPlan.PRO,
      } as any);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'UpgradeBrokerPlanUseCase');
    }
  }
}
