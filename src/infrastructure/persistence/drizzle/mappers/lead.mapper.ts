import { Lead } from '@domain/lead/entities/lead.entity';
import { LeadStatus } from '@domain/lead/value-objects/lead-status.vo';
import { LeadSource } from '@domain/lead/value-objects/lead-source.vo';
import { LeadSchema } from '../schema/lead.schema';

export class LeadMapper {
  static toDomain(schema: LeadSchema): Lead {
    return new Lead({
      id: schema.id,
      developerId: schema.developerId,
      assignedExecutiveId: schema.assignedExecutiveId,
      fullName: schema.fullName,
      nationalId: schema.nationalId,
      phone: schema.phone,
      email: schema.email ?? undefined,
      source: schema.source as LeadSource,
      status: schema.status as LeadStatus,
      interestedUnitIds: schema.interestedUnitIds as string[],
      notes: schema.notes ?? undefined,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>,
  ): Omit<LeadSchema, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      developerId: lead.developerId,
      assignedExecutiveId: lead.assignedExecutiveId,
      fullName: lead.fullName,
      nationalId: lead.nationalId,
      phone: lead.phone,
      email: lead.email ?? null,
      source: lead.source as any,
      status: lead.status as any,
      interestedUnitIds: lead.interestedUnitIds as any,
      notes: lead.notes ?? null,
    };
  }
}
