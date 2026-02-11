import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import {
  UserRepository,
  CreateUserData,
} from '@domain/user/repositories/user.repository';
import { User } from '@domain/user/entities/user.entity';
import { DrizzleService } from '../drizzle/drizzle.service';
import { users } from '../drizzle/schema';
import { UserMapper } from '../drizzle/mappers/user.mapper';

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(user: CreateUserData): Promise<User> {
    const [created] = await this.drizzle.db
      .insert(users)
      .values({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
        roles: user.roles as any,
        organizationId: user.organizationId,
        isActive: user.isActive,
        deleted: user.deleted ?? false,
      })
      .returning();

    return UserMapper.toDomain(created);
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.drizzle.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.deleted, false)))
      .limit(1);

    return user ? UserMapper.toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await this.drizzle.db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.deleted, false)))
      .limit(1);

    return user ? UserMapper.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const result = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.deleted, false));
    return result.map(UserMapper.toDomain);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const updateData: any = {};

    if (userData.name !== undefined) updateData.name = userData.name;
    if (userData.lastName !== undefined)
      updateData.lastName = userData.lastName;
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.phoneNumber !== undefined)
      updateData.phoneNumber = userData.phoneNumber;
    if (userData.password !== undefined)
      updateData.password = userData.password;
    if (userData.roles !== undefined) updateData.roles = userData.roles;
    if (userData.isActive !== undefined)
      updateData.isActive = userData.isActive;
    if (userData.deleted !== undefined) updateData.deleted = userData.deleted;

    const [updated] = await this.drizzle.db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return UserMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(users).where(eq(users.id, id));
  }

  async deleteAll(): Promise<void> {
    await this.drizzle.db.delete(users);
  }
}
