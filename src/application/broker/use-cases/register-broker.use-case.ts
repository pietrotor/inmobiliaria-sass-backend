import {
  Inject,
  Injectable,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import {
  BROKER_REPOSITORY,
  BrokerRepository,
} from '@domain/broker/repositories/broker.repository';
import { BrokerPlan } from '@domain/broker/value-objects/broker-plan.vo';
import { BrokerStatus } from '@domain/broker/value-objects/broker-status.vo';
import { RegisterBrokerDto } from '../dto/register-broker.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class RegisterBrokerUseCase {
  constructor(
    @Inject(BROKER_REPOSITORY)
    private readonly brokerRepository: BrokerRepository,
  ) {}

  async execute(userId: string, dto: RegisterBrokerDto) {
    try {
      const existing = await this.brokerRepository.findByUserId(userId);
      if (existing) {
        throw new BadRequestException('User already has a broker profile');
      }

      return await this.brokerRepository.create({
        userId,
        plan: BrokerPlan.FREE,
        status: BrokerStatus.PENDING,
        companyName: dto.companyName,
        licenseNumber: dto.licenseNumber,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'RegisterBrokerUseCase');
    }
  }
}
