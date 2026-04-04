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
import {
  DEVELOPER_REPOSITORY,
  DeveloperRepository,
} from '@domain/developer/repositories/developer.repository';
import {
  RESERVATION_INTENT_REPOSITORY,
  ReservationIntentRepository,
} from '@domain/intent/repositories/reservation-intent.repository';
import { LeadStatus } from '@domain/lead/value-objects/lead-status.vo';
import { CreateLeadDto } from '../dto/create-lead.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class CreateLeadUseCase {
  constructor(
    @Inject(LEAD_REPOSITORY)
    private readonly leadRepository: LeadRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    @Inject(RESERVATION_INTENT_REPOSITORY)
    private readonly intentRepository: ReservationIntentRepository,
  ) {}

  async execute(organizationId: string, dto: CreateLeadDto) {
    try {
      const developer =
        await this.developerRepository.findByOrganizationId(organizationId);
      if (!developer)
        throw new NotFoundException(
          'Developer profile not found for this organization',
        );

      let duplicateAlert: any = undefined;

      const existingLead =
        await this.leadRepository.findByNationalIdAndDeveloper(
          dto.nationalId,
          developer.id,
        );
      if (existingLead) {
        duplicateAlert = {
          isDuplicate: true,
          existingLeadId: existingLead.id,
          message: `A lead with national ID ${dto.nationalId} already exists for this developer`,
        };
      }

      const recentIntents =
        await this.intentRepository.findByClientNationalId(
          dto.nationalId,
          developer.id,
          90,
        );
      if (recentIntents.length > 0) {
        duplicateAlert = {
          isDuplicate: true,
          existingIntentBrokerId: recentIntents[0].brokerId,
          message: `A broker has an active/recent intent for a client with national ID ${dto.nationalId}`,
          ...(duplicateAlert ?? {}),
        };
      }

      const lead = await this.leadRepository.create({
        developerId: developer.id,
        assignedExecutiveId: dto.assignedExecutiveId ?? null,
        fullName: dto.fullName,
        nationalId: dto.nationalId,
        phone: dto.phone,
        email: dto.email,
        source: dto.source,
        status: LeadStatus.NEW,
        interestedUnitIds: dto.interestedUnitIds ?? [],
        notes: dto.notes,
      });

      return { ...lead, duplicateAlert };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'CreateLeadUseCase');
    }
  }
}
