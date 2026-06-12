import { Prisma } from '@prisma/client';
import prisma from '../../config/database';
import { softDeleteFilter, softDeleteData } from '../../common/utils/helpers';

export class LeadSourceRepository {
  async findById(id: string) {
    return prisma.leadSource.findFirst({
      where: { id, ...softDeleteFilter },
      include: { _count: { select: { leads: true } } },
    });
  }

  async findMany(skip = 0, take = 10) {
    return prisma.leadSource.findMany({
      where: softDeleteFilter,
      include: { _count: { select: { leads: true } } },
      skip,
      take,
      orderBy: { name: 'asc' },
    });
  }

  async count(): Promise<number> {
    return prisma.leadSource.count({ where: softDeleteFilter });
  }

  async create(data: Prisma.LeadSourceCreateInput) {
    return prisma.leadSource.create({ data });
  }

  async update(id: string, data: Prisma.LeadSourceUpdateInput) {
    return prisma.leadSource.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return prisma.leadSource.update({ where: { id }, data: softDeleteData() });
  }
}

export default new LeadSourceRepository();
