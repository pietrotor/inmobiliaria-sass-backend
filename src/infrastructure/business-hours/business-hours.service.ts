import { Injectable } from '@nestjs/common';

const BOLIVIAN_HOLIDAYS_2025_2027 = [
  '2025-01-01', '2025-01-22', '2025-02-12', '2025-03-03', '2025-03-04',
  '2025-04-18', '2025-05-01', '2025-06-19', '2025-08-02', '2025-08-06',
  '2025-11-02', '2025-12-25',
  '2026-01-01', '2026-01-22', '2026-02-12', '2026-02-16', '2026-02-17',
  '2026-04-03', '2026-05-01', '2026-06-04', '2026-06-21', '2026-08-02',
  '2026-08-06', '2026-11-02', '2026-12-25',
  '2027-01-01', '2027-01-22', '2027-02-08', '2027-02-09',
  '2027-03-26', '2027-05-01', '2027-05-27', '2027-06-21', '2027-08-02',
  '2027-08-06', '2027-11-02', '2027-12-25',
];

const WORK_START_HOUR = 8;
const WORK_END_HOUR = 18;
const WORK_HOURS_PER_DAY = WORK_END_HOUR - WORK_START_HOUR;

@Injectable()
export class BusinessHoursService {
  private readonly holidays: Set<string>;

  constructor() {
    this.holidays = new Set(BOLIVIAN_HOLIDAYS_2025_2027);
  }

  isBusinessDay(date: Date): boolean {
    const day = date.getDay();
    if (day === 0 || day === 6) return false;
    const dateStr = this.formatDate(date);
    return !this.holidays.has(dateStr);
  }

  addBusinessHours(startDate: Date, hours: number): Date {
    let remaining = hours;
    const current = new Date(startDate);

    if (!this.isBusinessDay(current) || current.getHours() >= WORK_END_HOUR) {
      this.moveToNextBusinessDayStart(current);
    } else if (current.getHours() < WORK_START_HOUR) {
      current.setHours(WORK_START_HOUR, 0, 0, 0);
    }

    while (remaining > 0) {
      if (!this.isBusinessDay(current)) {
        this.moveToNextBusinessDayStart(current);
        continue;
      }

      const currentHour = current.getHours() + current.getMinutes() / 60;
      const hoursLeftToday = WORK_END_HOUR - currentHour;

      if (hoursLeftToday <= 0) {
        this.moveToNextBusinessDayStart(current);
        continue;
      }

      if (remaining <= hoursLeftToday) {
        current.setTime(current.getTime() + remaining * 60 * 60 * 1000);
        remaining = 0;
      } else {
        remaining -= hoursLeftToday;
        current.setDate(current.getDate() + 1);
        current.setHours(WORK_START_HOUR, 0, 0, 0);
      }
    }

    return current;
  }

  getRemainingBusinessMs(deadline: Date): number {
    const now = new Date();
    if (now >= deadline) return 0;

    let remaining = 0;
    const current = new Date(now);

    while (current < deadline) {
      if (!this.isBusinessDay(current)) {
        current.setDate(current.getDate() + 1);
        current.setHours(WORK_START_HOUR, 0, 0, 0);
        continue;
      }

      const endTime = new Date(current);
      endTime.setHours(WORK_END_HOUR, 0, 0, 0);

      if (current.getHours() >= WORK_END_HOUR) {
        current.setDate(current.getDate() + 1);
        current.setHours(WORK_START_HOUR, 0, 0, 0);
        continue;
      }

      const effectiveEnd = deadline < endTime ? deadline : endTime;
      const effectiveStart = new Date(current);
      if (effectiveStart.getHours() < WORK_START_HOUR) {
        effectiveStart.setHours(WORK_START_HOUR, 0, 0, 0);
      }

      if (effectiveEnd > effectiveStart) {
        remaining += effectiveEnd.getTime() - effectiveStart.getTime();
      }

      current.setDate(current.getDate() + 1);
      current.setHours(WORK_START_HOUR, 0, 0, 0);
    }

    return remaining;
  }

  private moveToNextBusinessDayStart(date: Date): void {
    do {
      date.setDate(date.getDate() + 1);
    } while (!this.isBusinessDay(date));
    date.setHours(WORK_START_HOUR, 0, 0, 0);
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
