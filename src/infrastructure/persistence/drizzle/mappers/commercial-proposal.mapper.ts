import { CommercialProposal } from '@domain/proposal/entities/commercial-proposal.entity';
import { ProposalType } from '@domain/proposal/value-objects/proposal-type.vo';
import { CommercialProposalSchema } from '../schema/commercial-proposal.schema';

export class CommercialProposalMapper {
  static toDomain(schema: CommercialProposalSchema): CommercialProposal {
    return new CommercialProposal({
      id: schema.id,
      type: schema.type as ProposalType,
      brokerId: schema.brokerId ?? undefined,
      executiveId: schema.executiveId ?? undefined,
      developerId: schema.developerId,
      clientName: schema.clientName,
      clientNationalId: schema.clientNationalId,
      clientPhone: schema.clientPhone,
      clientEmail: schema.clientEmail ?? undefined,
      units: schema.units as any,
      totalPriceUSD: schema.totalPriceUSD,
      estimatedCommissionUSD: schema.estimatedCommissionUSD,
      generatedAt: schema.generatedAt,
      validUntil: schema.validUntil,
    });
  }

  static toPersistence(
    entity: Omit<CommercialProposal, 'id'>,
  ): Omit<CommercialProposalSchema, 'id'> {
    return {
      type: entity.type as any,
      brokerId: entity.brokerId ?? null,
      executiveId: entity.executiveId ?? null,
      developerId: entity.developerId,
      clientName: entity.clientName,
      clientNationalId: entity.clientNationalId,
      clientPhone: entity.clientPhone,
      clientEmail: entity.clientEmail ?? null,
      units: entity.units as any,
      totalPriceUSD: entity.totalPriceUSD,
      estimatedCommissionUSD: entity.estimatedCommissionUSD,
      generatedAt: entity.generatedAt,
      validUntil: entity.validUntil,
    };
  }
}
