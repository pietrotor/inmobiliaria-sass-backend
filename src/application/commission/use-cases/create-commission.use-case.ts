import { Inject, Injectable, HttpException } from '@nestjs/common';
import {
  COMMISSION_REPOSITORY,
  CommissionRepository,
} from '@domain/commission/repositories/commission.repository';
import { CommissionStatus } from '@domain/commission/value-objects/commission-status.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class CreateCommissionUseCase {
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly repo: CommissionRepository,
  ) {}

  async execute(data: {
    brokerId: string;
    intentId: string;
    reservationId: string;
    developerId: string;
    units: any[];
    totalAmountUSD: number;
  }) {
    try {
      return await this.repo.create({
        ...data,
        status: CommissionStatus.PENDING,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'CreateCommissionUseCase');
    }
  }
}
