import { ReservationIntent } from '@domain/intent/entities/reservation-intent.entity';
import { IntentStatus } from '@domain/intent/value-objects/intent-status.vo';
import { RejectionReason } from '@domain/intent/value-objects/rejection-reason.vo';
import { ReservationIntentSchema } from '../schema/reservation-intent.schema';

export class ReservationIntentMapper {
  static toDomain(schema: ReservationIntentSchema): ReservationIntent {
    return new ReservationIntent({
      id: schema.id,
      brokerId: schema.brokerId,
      projectId: schema.projectId,
      unitIds: schema.unitIds as string[],
      clientName: schema.clientName,
      clientNationalId: schema.clientNationalId,
      clientPhone: schema.clientPhone,
      clientEmail: schema.clientEmail ?? undefined,
      hasFinancing: schema.hasFinancing,
      hasVisited: schema.hasVisited,
      status: schema.status as IntentStatus,
      deadlineAt: schema.deadlineAt,
      pausedTimeRemainingMs: schema.pausedTimeRemainingMs ?? undefined,
      rejectionReason: schema.rejectionReason as RejectionReason | undefined,
      rejectionNote: schema.rejectionNote ?? undefined,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    entity: Omit<ReservationIntent, 'id' | 'createdAt' | 'updatedAt'>,
  ): Omit<ReservationIntentSchema, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      brokerId: entity.brokerId,
      projectId: entity.projectId,
      unitIds: entity.unitIds as any,
      clientName: entity.clientName,
      clientNationalId: entity.clientNationalId,
      clientPhone: entity.clientPhone,
      clientEmail: entity.clientEmail ?? null,
      hasFinancing: entity.hasFinancing,
      hasVisited: entity.hasVisited,
      status: entity.status as any,
      deadlineAt: entity.deadlineAt,
      pausedTimeRemainingMs: entity.pausedTimeRemainingMs ?? null,
      rejectionReason: (entity.rejectionReason as any) ?? null,
      rejectionNote: entity.rejectionNote ?? null,
    };
  }
}
