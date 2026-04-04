import { Commission } from '@domain/commission/entities/commission.entity';
import { CommissionStatus } from '@domain/commission/value-objects/commission-status.vo';
import { CommissionSchema } from '../schema/commission.schema';

export class CommissionMapper {
  static toDomain(schema: CommissionSchema): Commission {
    return new Commission({
      id: schema.id,
      brokerId: schema.brokerId,
      intentId: schema.intentId,
      reservationId: schema.reservationId,
      developerId: schema.developerId,
      units: schema.units as any,
      totalAmountUSD: schema.totalAmountUSD,
      status: schema.status as CommissionStatus,
      paidAt: schema.paidAt ?? undefined,
      paidByUserId: schema.paidByUserId ?? undefined,
      disputeNote: schema.disputeNote ?? undefined,
      createdAt: schema.createdAt,
    });
  }

  static toPersistence(
    entity: Omit<Commission, 'id' | 'createdAt'>,
  ): Omit<CommissionSchema, 'id' | 'createdAt'> {
    return {
      brokerId: entity.brokerId,
      intentId: entity.intentId,
      reservationId: entity.reservationId,
      developerId: entity.developerId,
      units: entity.units as any,
      totalAmountUSD: entity.totalAmountUSD,
      status: entity.status as any,
      paidAt: entity.paidAt ?? null,
      paidByUserId: entity.paidByUserId ?? null,
      disputeNote: entity.disputeNote ?? null,
    };
  }
}
