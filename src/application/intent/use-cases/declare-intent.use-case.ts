import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  RESERVATION_INTENT_REPOSITORY,
  ReservationIntentRepository,
} from '@domain/intent/repositories/reservation-intent.repository';
import {
  UNIT_REPOSITORY,
  UnitRepository,
} from '@domain/unit/repositories/unit.repository';
import {
  BROKER_REPOSITORY,
  BrokerRepository,
} from '@domain/broker/repositories/broker.repository';
import {
  PROJECT_REPOSITORY,
  ProjectRepository,
} from '@domain/project/repositories/project.repository';
import { IntentStatus } from '@domain/intent/value-objects/intent-status.vo';
import { UnitStatus } from '@domain/unit/value-objects/unit-status.vo';
import { BusinessHoursService } from '@infrastructure/business-hours/business-hours.service';
import { DeclareIntentDto } from '../dto/declare-intent.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DeclareIntentUseCase {
  constructor(
    @Inject(RESERVATION_INTENT_REPOSITORY)
    private readonly intentRepo: ReservationIntentRepository,
    @Inject(UNIT_REPOSITORY)
    private readonly unitRepo: UnitRepository,
    @Inject(BROKER_REPOSITORY)
    private readonly brokerRepo: BrokerRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepo: ProjectRepository,
    private readonly businessHoursService: BusinessHoursService,
  ) {}

  async execute(userId: string, dto: DeclareIntentDto) {
    try {
      const broker = await this.brokerRepo.findByUserId(userId);
      if (!broker) throw new NotFoundException('Broker profile not found');
      if (!broker.canDeclareIntent()) {
        throw new ForbiddenException(
          'Broker must be approved and on PRO plan to declare intents',
        );
      }

      const project = await this.projectRepo.findById(dto.projectId);
      if (!project) throw new NotFoundException('Project not found');
      if (!project.isPublished())
        throw new BadRequestException('Project is not published');

      for (const unitId of dto.unitIds) {
        const unit = await this.unitRepo.findById(unitId);
        if (!unit) throw new NotFoundException(`Unit ${unitId} not found`);
        if (unit.projectId !== dto.projectId)
          throw new BadRequestException(
            `Unit ${unitId} does not belong to this project`,
          );
        if (!unit.isAvailable())
          throw new BadRequestException(
            `Unit ${unitId} is not available (status: ${unit.status})`,
          );

        const existingIntent =
          await this.intentRepo.findActiveByUnitId(unitId);
        if (existingIntent)
          throw new BadRequestException(
            `Unit ${unitId} already has an active intent`,
          );
      }

      const deadlineAt = this.businessHoursService.addBusinessHours(
        new Date(),
        project.intentDeadlineHours,
      );

      const intent = await this.intentRepo.create({
        brokerId: broker.id,
        projectId: dto.projectId,
        unitIds: dto.unitIds,
        clientName: dto.clientName,
        clientNationalId: dto.clientNationalId,
        clientPhone: dto.clientPhone,
        clientEmail: dto.clientEmail,
        hasFinancing: dto.hasFinancing,
        hasVisited: dto.hasVisited,
        status: IntentStatus.ACTIVE,
        deadlineAt,
      });

      for (const unitId of dto.unitIds) {
        await this.unitRepo.update(unitId, {
          status: UnitStatus.WITH_INTEREST,
        } as any);
      }

      return intent;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'DeclareIntentUseCase');
    }
  }
}
