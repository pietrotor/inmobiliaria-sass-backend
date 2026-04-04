import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import {
  COMMERCIAL_PROPOSAL_REPOSITORY,
  CommercialProposalRepository,
} from '@domain/proposal/repositories/commercial-proposal.repository';
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
import { ProposalType } from '@domain/proposal/value-objects/proposal-type.vo';
import { CreateProposalDto } from '../dto/create-proposal.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GenerateProposalUseCase {
  constructor(
    @Inject(COMMERCIAL_PROPOSAL_REPOSITORY)
    private readonly proposalRepo: CommercialProposalRepository,
    @Inject(UNIT_REPOSITORY)
    private readonly unitRepo: UnitRepository,
    @Inject(BROKER_REPOSITORY)
    private readonly brokerRepo: BrokerRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepo: ProjectRepository,
  ) {}

  async execute(userId: string, isBroker: boolean, dto: CreateProposalDto) {
    try {
      const unitSnapshots = [];
      let totalPrice = 0;
      let totalCommission = 0;
      let developerId: string | undefined;

      for (const unitId of dto.unitIds) {
        const unit = await this.unitRepo.findById(unitId);
        if (!unit) throw new NotFoundException(`Unit ${unitId} not found`);

        const project = await this.projectRepo.findById(unit.projectId);
        if (!project) throw new NotFoundException('Project not found');

        if (!developerId) developerId = project.developerId;

        const commPct =
          unit.commissionPctOverride ?? project.defaultCommissionPct;
        const commAmount = (unit.priceUSD * commPct) / 100;

        unitSnapshots.push({
          unitId: unit.id,
          identifier: unit.identifier,
          priceUSD: unit.priceUSD,
          commissionPct: commPct,
        });
        totalPrice += unit.priceUSD;
        totalCommission += commAmount;
      }

      const now = new Date();
      const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      let brokerId: string | undefined;
      if (isBroker) {
        const broker = await this.brokerRepo.findByUserId(userId);
        if (broker) brokerId = broker.id;
      }

      return await this.proposalRepo.create({
        type: isBroker ? ProposalType.BROKER : ProposalType.DIRECT,
        brokerId,
        executiveId: isBroker ? undefined : userId,
        developerId: developerId!,
        clientName: dto.clientName,
        clientNationalId: dto.clientNationalId,
        clientPhone: dto.clientPhone,
        clientEmail: dto.clientEmail,
        units: unitSnapshots,
        totalPriceUSD: totalPrice,
        estimatedCommissionUSD: totalCommission,
        generatedAt: now,
        validUntil,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'GenerateProposalUseCase');
    }
  }
}
