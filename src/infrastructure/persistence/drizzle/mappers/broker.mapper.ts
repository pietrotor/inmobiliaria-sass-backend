import { Broker } from '@domain/broker/entities/broker.entity';
import { BrokerPlan } from '@domain/broker/value-objects/broker-plan.vo';
import { BrokerStatus } from '@domain/broker/value-objects/broker-status.vo';
import { BrokerSchema } from '../schema/broker.schema';

export class BrokerMapper {
  static toDomain(schema: BrokerSchema): Broker {
    return new Broker({
      id: schema.id,
      userId: schema.userId,
      plan: schema.plan as BrokerPlan,
      status: schema.status as BrokerStatus,
      companyName: schema.companyName ?? undefined,
      licenseNumber: schema.licenseNumber ?? undefined,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    broker: Omit<Broker, 'id' | 'createdAt' | 'updatedAt'>,
  ): Omit<BrokerSchema, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      userId: broker.userId,
      plan: broker.plan as any,
      status: broker.status as any,
      companyName: broker.companyName ?? null,
      licenseNumber: broker.licenseNumber ?? null,
    };
  }
}
