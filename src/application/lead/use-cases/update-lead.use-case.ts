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
import { UpdateLeadDto } from '../dto/update-lead.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpdateLeadUseCase {
  constructor(
    @Inject(LEAD_REPOSITORY)
    private readonly leadRepository: LeadRepository,
  ) {}

  async execute(leadId: string, dto: UpdateLeadDto) {
    try {
      const lead = await this.leadRepository.findById(leadId);
      if (!lead) throw new NotFoundException('Lead not found');

      return await this.leadRepository.update(leadId, dto as any);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'UpdateLeadUseCase');
    }
  }
}
