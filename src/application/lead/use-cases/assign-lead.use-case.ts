import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import {
  LEAD_REPOSITORY,
  LeadRepository,
} from '@domain/lead/repositories/lead.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class AssignLeadUseCase {
  constructor(
    @Inject(LEAD_REPOSITORY)
    private readonly leadRepository: LeadRepository,
  ) {}

  async execute(leadId: string, executiveId: string) {
    try {
      const lead = await this.leadRepository.findById(leadId);
      if (!lead) throw new NotFoundException('Lead not found');

      return await this.leadRepository.update(leadId, {
        assignedExecutiveId: executiveId,
      } as any);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'AssignLeadUseCase');
    }
  }
}
