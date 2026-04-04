import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  COMMISSION_REPOSITORY,
  CommissionRepository,
} from '@domain/commission/repositories/commission.repository';
import { CommissionStatus } from '@domain/commission/value-objects/commission-status.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class MarkCommissionPaidUseCase {
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly repo: CommissionRepository,
  ) {}

  async execute(commissionId: string, userId: string) {
    try {
      const commission = await this.repo.findById(commissionId);
      if (!commission) throw new NotFoundException('Commission not found');
      if (!commission.isPending())
        throw new BadRequestException('Commission is not pending');

      return await this.repo.update(commissionId, {
        status: CommissionStatus.PAID,
        paidAt: new Date(),
        paidByUserId: userId,
      } as any);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'MarkCommissionPaidUseCase');
    }
  }
}
