import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  LEAD_REPOSITORY,
  LeadRepository,
} from '@domain/lead/repositories/lead.repository';
import {
  LEAD_STATUS_HISTORY_REPOSITORY,
  LeadStatusHistoryRepository,
} from '@domain/lead/repositories/lead-status-history.repository';
import { LeadStatus } from '@domain/lead/value-objects/lead-status.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class AdvanceLeadStatusUseCase {
  constructor(
    @Inject(LEAD_REPOSITORY)
    private readonly leadRepository: LeadRepository,
    @Inject(LEAD_STATUS_HISTORY_REPOSITORY)
    private readonly historyRepository: LeadStatusHistoryRepository,
  ) {}

  async execute(leadId: string, targetStatus: LeadStatus, userId: string) {
    try {
      const lead = await this.leadRepository.findById(leadId);
      if (!lead) throw new NotFoundException('Lead not found');

      if (!lead.canTransitionTo(targetStatus)) {
        throw new BadRequestException(
          `Cannot transition lead from ${lead.status} to ${targetStatus}`,
        );
      }

      await this.historyRepository.create({
        leadId,
        fromStatus: lead.status,
        toStatus: targetStatus,
        changedByUserId: userId,
      });

      return await this.leadRepository.update(leadId, {
        status: targetStatus,
      } as any);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'AdvanceLeadStatusUseCase');
    }
  }
}
