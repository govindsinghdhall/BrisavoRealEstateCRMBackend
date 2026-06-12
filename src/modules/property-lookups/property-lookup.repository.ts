import { Prisma, PropertyLookupType } from '@prisma/client';
import prisma from '../../config/database';
import { softDeleteFilter } from '../../common/utils/helpers';

export class PropertyLookupRepository {
  async findByType(organizationId: string, type: PropertyLookupType) {
    return prisma.propertyLookup.findMany({
      where: { organizationId, type, ...softDeleteFilter },
      orderBy: [{ usageCount: 'desc' }, { value: 'asc' }],
      select: { id: true, type: true, value: true, usageCount: true },
    });
  }

  async findAll(organizationId: string) {
    return prisma.propertyLookup.findMany({
      where: { organizationId, ...softDeleteFilter },
      orderBy: [{ type: 'asc' }, { usageCount: 'desc' }, { value: 'asc' }],
      select: { id: true, type: true, value: true, usageCount: true },
    });
  }

  async findByNormalized(organizationId: string, type: PropertyLookupType, normalizedValue: string) {
    return prisma.propertyLookup.findFirst({
      where: { organizationId, type, normalizedValue, ...softDeleteFilter },
    });
  }

  async create(data: Prisma.PropertyLookupCreateInput) {
    return prisma.propertyLookup.create({ data });
  }

  async incrementUsage(id: string) {
    return prisma.propertyLookup.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    });
  }
}

export default new PropertyLookupRepository();
