import { BrokerProjectAccess } from '@domain/broker/entities/broker-project-access.entity';
import { BrokerAccessStatus } from '@domain/broker/value-objects/broker-access-status.vo';
import { BrokerProjectAccessSchema } from '../schema/broker-project-access.schema';

export class BrokerProjectAccessMapper {
  static toDomain(schema: BrokerProjectAccessSchema): BrokerProjectAccess {
    return new BrokerProjectAccess({
      id: schema.id,
      brokerId: schema.brokerId,
      projectId: schema.projectId,
      status: schema.status as BrokerAccessStatus,
      createdAt: schema.createdAt,
    });
  }

  static toPersistence(
    entity: Omit<BrokerProjectAccess, 'id' | 'createdAt'>,
  ): Omit<BrokerProjectAccessSchema, 'id' | 'createdAt'> {
    return {
      brokerId: entity.brokerId,
      projectId: entity.projectId,
      status: entity.status as any,
    };
  }
}
