import { Prisma } from '@prisma/client';

export const softDeleteFilter = { deletedAt: null };

export function softDeleteData(): { deletedAt: Date } {
  return { deletedAt: new Date() };
}

export function excludeDeleted<T extends { deletedAt?: Date | null }>(
  where: T = {} as T
): T & { deletedAt: null } {
  return { ...where, deletedAt: null };
}

export function decimalToNumber(value: Prisma.Decimal | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  return Number(value);
}

export function generateBookingNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BK-${timestamp}-${random}`;
}

export function parseExpiresIn(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 3600000;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * (multipliers[unit] || 3600000);
}
