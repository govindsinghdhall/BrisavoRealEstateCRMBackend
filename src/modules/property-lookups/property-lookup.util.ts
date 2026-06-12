import { BadRequestError } from '../../common/errors/app.error';
import { PropertyLookupTypeEnum } from './property-lookup.constants';

export function normalizeLookupValue(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function normalizeLookupKey(value: string): string {
  return normalizeLookupValue(value).toLowerCase();
}

export function validateLookupValue(type: PropertyLookupTypeEnum, value: string): string {
  const normalized = normalizeLookupValue(value);
  if (!normalized) {
    throw new BadRequestError('Value is required');
  }

  if (type === PropertyLookupTypeEnum.PINCODE && !/^\d{6}$/.test(normalized)) {
    throw new BadRequestError('Pincode must be a 6-digit number');
  }

  if (normalized.length > 120) {
    throw new BadRequestError('Value is too long (max 120 characters)');
  }

  return normalized;
}
