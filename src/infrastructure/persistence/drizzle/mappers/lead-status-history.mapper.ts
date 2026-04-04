import { LeadStatusHistory } from '@domain/lead/entities/lead-status-history.entity';
import { LeadStatus } from '@domain/lead/value-objects/lead-status.vo';
import { LeadStatusHistorySchema } from '../schema/lead-status-history.schema';

export class LeadStatusHistoryMapper {
  static toDomain(schema: LeadStatusHistorySchema): LeadStatusHistory {
    return new LeadStatusHistory({
      id: schema.id,
      leadId: schema.leadId,
      fromStatus: schema.fromStatus as LeadStatus,
      toStatus: schema.toStatus as LeadStatus,
      changedByUserId: schema.changedByUserId,
      changedAt: schema.changedAt,
    });
  }

  static toPersistence(
    entity: Omit<LeadStatusHistory, 'id' | 'changedAt'>,
  ): Omit<LeadStatusHistorySchema, 'id' | 'changedAt'> {
    return {
      leadId: entity.leadId,
      fromStatus: entity.fromStatus as any,
      toStatus: entity.toStatus as any,
      changedByUserId: entity.changedByUserId,
    };
  }
}
