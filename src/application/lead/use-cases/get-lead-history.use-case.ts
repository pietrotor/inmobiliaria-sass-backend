import { Inject, Injectable, HttpException } from '@nestjs/common';
import {
  LEAD_STATUS_HISTORY_REPOSITORY,
  LeadStatusHistoryRepository,
} from '@domain/lead/repositories/lead-status-history.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetLeadHistoryUseCase {
  constructor(
    @Inject(LEAD_STATUS_HISTORY_REPOSITORY)
    private readonly historyRepository: LeadStatusHistoryRepository,
  ) {}

  async execute(leadId: string) {
    try {
      return await this.historyRepository.findByLeadId(leadId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'GetLeadHistoryUseCase');
    }
  }
}
