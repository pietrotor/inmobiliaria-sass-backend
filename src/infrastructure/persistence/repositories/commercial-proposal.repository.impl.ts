import { Injectable } from '@nestjs/common';
import { eq, and, desc, count } from 'drizzle-orm';

import { CommercialProposal } from '@domain/proposal/entities/commercial-proposal.entity';
import {
  CommercialProposalRepository,
  CreateCommercialProposalData,
} from '@domain/proposal/repositories/commercial-proposal.repository';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';
import { DrizzleService } from '../drizzle/drizzle.service';
import { commercialProposals } from '../drizzle/schema/commercial-proposal.schema';
import { CommercialProposalMapper } from '../drizzle/mappers/commercial-proposal.mapper';

@Injectable()
export class DrizzleCommercialProposalRepository
  implements CommercialProposalRepository
{
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    data: CreateCommercialProposalData,
  ): Promise<CommercialProposal> {
    const [created] = await this.drizzle.db
      .insert(commercialProposals)
      .values({
        type: data.type as any,
        brokerId: data.brokerId ?? null,
        executiveId: data.executiveId ?? null,
        developerId: data.developerId,
        clientName: data.clientName,
        clientNationalId: data.clientNationalId,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail ?? null,
        units: data.units,
        totalPriceUSD: data.totalPriceUSD,
        estimatedCommissionUSD: data.estimatedCommissionUSD,
        generatedAt: data.generatedAt,
        validUntil: data.validUntil,
      })
      .returning();
    return CommercialProposalMapper.toDomain(created);
  }

  async findById(id: string): Promise<CommercialProposal | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(commercialProposals)
      .where(eq(commercialProposals.id, id));
    return result ? CommercialProposalMapper.toDomain(result) : null;
  }

  async findByBrokerId(
    brokerId: string,
    limit: number,
    offset: number,
  ): Promise<PaginatedResult<CommercialProposal>> {
    const [totalResult] = await this.drizzle.db
      .select({ count: count() })
      .from(commercialProposals)
      .where(eq(commercialProposals.brokerId, brokerId));

    const results = await this.drizzle.db
      .select()
      .from(commercialProposals)
      .where(eq(commercialProposals.brokerId, brokerId))
      .orderBy(desc(commercialProposals.generatedAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results.map(CommercialProposalMapper.toDomain),
      total: totalResult?.count ?? 0,
      limit,
      offset,
    };
  }

  async findByDeveloperId(
    developerId: string,
    limit: number,
    offset: number,
  ): Promise<PaginatedResult<CommercialProposal>> {
    const [totalResult] = await this.drizzle.db
      .select({ count: count() })
      .from(commercialProposals)
      .where(eq(commercialProposals.developerId, developerId));

    const results = await this.drizzle.db
      .select()
      .from(commercialProposals)
      .where(eq(commercialProposals.developerId, developerId))
      .orderBy(desc(commercialProposals.generatedAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results.map(CommercialProposalMapper.toDomain),
      total: totalResult?.count ?? 0,
      limit,
      offset,
    };
  }

  async findByClientNationalId(
    nationalId: string,
    developerId: string,
  ): Promise<CommercialProposal[]> {
    const results = await this.drizzle.db
      .select()
      .from(commercialProposals)
      .where(
        and(
          eq(commercialProposals.clientNationalId, nationalId),
          eq(commercialProposals.developerId, developerId),
        ),
      );
    return results.map(CommercialProposalMapper.toDomain);
  }
}
