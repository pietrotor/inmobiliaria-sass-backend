import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import {
  COMMISSION_REPOSITORY,
  CommissionRepository,
} from '@domain/commission/repositories/commission.repository';
import { CommissionStatus } from '@domain/commission/value-objects/commission-status.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DisputeCommissionUseCase {
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly repo: CommissionRepository,
  ) {}

  async execute(commissionId: string, note: string) {
    try {
      const commission = await this.repo.findById(commissionId);
      if (!commission) throw new NotFoundException('Commission not found');

      return await this.repo.update(commissionId, {
        status: CommissionStatus.IN_DISPUTE,
        disputeNote: note,
      } as any);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'DisputeCommissionUseCase');
    }
  }
}
