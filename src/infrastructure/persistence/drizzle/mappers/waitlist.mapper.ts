import { Waitlist } from '@domain/intent/entities/waitlist.entity';
import { WaitlistStatus } from '@domain/intent/value-objects/waitlist-status.vo';
import { WaitlistSchema } from '../schema/waitlist.schema';

export class WaitlistMapper {
  static toDomain(schema: WaitlistSchema): Waitlist {
    return new Waitlist({
      id: schema.id,
      unitId: schema.unitId,
      brokerId: schema.brokerId,
      position: schema.position,
      status: schema.status as WaitlistStatus,
      notifiedAt: schema.notifiedAt ?? undefined,
      expiresAt: schema.expiresAt ?? undefined,
      createdAt: schema.createdAt,
    });
  }

  static toPersistence(
    entity: Omit<Waitlist, 'id' | 'createdAt'>,
  ): Omit<WaitlistSchema, 'id' | 'createdAt'> {
    return {
      unitId: entity.unitId,
      brokerId: entity.brokerId,
      position: entity.position,
      status: entity.status as any,
      notifiedAt: entity.notifiedAt ?? null,
      expiresAt: entity.expiresAt ?? null,
    };
  }
}
