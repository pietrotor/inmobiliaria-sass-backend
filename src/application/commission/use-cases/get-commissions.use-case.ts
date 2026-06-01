import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import {
  COMMISSION_REPOSITORY,
  CommissionRepository,
  CommissionFilters,
} from '@domain/commission/repositories/commission.repository';
import {
  DEVELOPER_REPOSITORY,
  DeveloperRepository,
} from '@domain/developer/repositories/developer.repository';
import {
  BROKER_REPOSITORY,
  BrokerRepository,
} from '@domain/broker/repositories/broker.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetCommissionsUseCase {
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly commissionRepo: CommissionRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepo: DeveloperRepository,
    @Inject(BROKER_REPOSITORY)
    private readonly brokerRepo: BrokerRepository,
  ) {}

  async execute(
    userId: string,
    role: string,
    organizationId: string,
    limit: number,
    offset: number,
    filters?: CommissionFilters,
  ) {
    try {
      if (role === 'BROKER') {
        const broker = await this.brokerRepo.findByUserId(userId);
        if (!broker) throw new NotFoundException('Broker not found');
        return await this.commissionRepo.findByBrokerId(
          broker.id,
          limit,
          offset,
          filters,
        );
      }

      const developer =
        await this.developerRepo.findByOrganizationId(organizationId);
      if (!developer) throw new NotFoundException('Developer not found');
      return await this.commissionRepo.findByDeveloperId(
        developer.id,
        limit,
        offset,
        filters,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'GetCommissionsUseCase');
    }
  }
}
