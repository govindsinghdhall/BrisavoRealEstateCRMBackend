import { Prisma } from '@prisma/client';
import prisma from '../../config/database';
import { softDeleteFilter, softDeleteData } from '../../common/utils/helpers';

const propertyInclude = {
  project: { select: { id: true, name: true, city: true } },
  images: { orderBy: { sortOrder: 'asc' as const } },
  _count: { select: { leads: true } },
};

export class PropertyRepository {
  async findById(id: string) {
    return prisma.property.findFirst({
      where: { id, ...softDeleteFilter },
      include: propertyInclude,
    });
  }

  async findMany(
    where: Prisma.PropertyWhereInput = {},
    skip = 0,
    take = 10,
    orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: 'desc' }
  ) {
    return prisma.property.findMany({
      where: { ...where, ...softDeleteFilter },
      include: propertyInclude,
      skip,
      take,
      orderBy,
    });
  }

  async count(where: Prisma.PropertyWhereInput = {}): Promise<number> {
    return prisma.property.count({ where: { ...where, ...softDeleteFilter } });
  }

  async create(data: Prisma.PropertyCreateInput) {
    return prisma.property.create({ data, include: propertyInclude });
  }

  async update(id: string, data: Prisma.PropertyUpdateInput) {
    return prisma.property.update({ where: { id }, data, include: propertyInclude });
  }

  async softDelete(id: string) {
    return prisma.property.update({ where: { id }, data: softDeleteData() });
  }

  async addImage(propertyId: string, url: string, caption?: string, isPrimary = false) {
    if (isPrimary) {
      await prisma.propertyImage.updateMany({
        where: { propertyId },
        data: { isPrimary: false },
      });
    }

    const count = await prisma.propertyImage.count({ where: { propertyId } });

    return prisma.propertyImage.create({
      data: { propertyId, url, caption, isPrimary, sortOrder: count },
    });
  }

  async updateBrochure(id: string, brochureUrl: string) {
    return prisma.property.update({
      where: { id },
      data: { brochureUrl },
      include: propertyInclude,
    });
  }

  async getInventory() {
    const [byStatus, byType, byCity] = await Promise.all([
      prisma.property.groupBy({
        by: ['status'],
        where: softDeleteFilter,
        _count: true,
      }),
      prisma.property.groupBy({
        by: ['type'],
        where: softDeleteFilter,
        _count: true,
      }),
      prisma.property.groupBy({
        by: ['city'],
        where: softDeleteFilter,
        _count: true,
      }),
    ]);

    return { byStatus, byType, byCity };
  }
}

export default new PropertyRepository();
