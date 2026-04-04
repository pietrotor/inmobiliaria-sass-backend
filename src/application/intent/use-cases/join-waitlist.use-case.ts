import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  WAITLIST_REPOSITORY,
  WaitlistRepository,
} from '@domain/intent/repositories/waitlist.repository';
import {
  BROKER_REPOSITORY,
  BrokerRepository,
} from '@domain/broker/repositories/broker.repository';
import {
  UNIT_REPOSITORY,
  UnitRepository,
} from '@domain/unit/repositories/unit.repository';
import { WaitlistStatus } from '@domain/intent/value-objects/waitlist-status.vo';
import { UnitStatus } from '@domain/unit/value-objects/unit-status.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class JoinWaitlistUseCase {
  constructor(
    @Inject(WAITLIST_REPOSITORY)
    private readonly waitlistRepo: WaitlistRepository,
    @Inject(BROKER_REPOSITORY)
    private readonly brokerRepo: BrokerRepository,
    @Inject(UNIT_REPOSITORY)
    private readonly unitRepo: UnitRepository,
  ) {}

  async execute(userId: string, unitId: string) {
    try {
      const broker = await this.brokerRepo.findByUserId(userId);
      if (!broker) throw new NotFoundException('Broker profile not found');
      if (!broker.canDeclareIntent())
        throw new ForbiddenException('PRO plan required');

      const unit = await this.unitRepo.findById(unitId);
      if (!unit) throw new NotFoundException('Unit not found');
      if (unit.status !== UnitStatus.WITH_INTEREST) {
        throw new BadRequestException(
          'Unit must have an active intent to join waitlist',
        );
      }

      const maxPosition = await this.waitlistRepo.getMaxPosition(unitId);

      return await this.waitlistRepo.create({
        unitId,
        brokerId: broker.id,
        position: maxPosition + 1,
        status: WaitlistStatus.WAITING,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'JoinWaitlistUseCase');
    }
  }
}
