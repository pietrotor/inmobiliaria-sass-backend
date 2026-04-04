import { Waitlist } from '../entities/waitlist.entity';

export const WAITLIST_REPOSITORY = 'WAITLIST_REPOSITORY';

export interface CreateWaitlistData {
  unitId: string;
  brokerId: string;
  position: number;
  status: string;
}

export interface WaitlistRepository {
  create(data: CreateWaitlistData): Promise<Waitlist>;
  findById(id: string): Promise<Waitlist | null>;
  findByUnitId(unitId: string): Promise<Waitlist[]>;
  findNextWaiting(unitId: string): Promise<Waitlist | null>;
  findByBrokerId(brokerId: string): Promise<Waitlist[]>;
  findExpiredNotified(): Promise<Waitlist[]>;
  getMaxPosition(unitId: string): Promise<number>;
  update(id: string, data: Partial<Waitlist>): Promise<Waitlist>;
  discardAllByUnitId(unitId: string): Promise<void>;
  delete(id: string): Promise<void>;
}
