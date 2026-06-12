import { Prisma } from '@prisma/client';
import prisma from '../../config/database';
import { softDeleteFilter, softDeleteData } from '../../common/utils/helpers';

const visitInclude = {
  lead: { select: { id: true, firstName: true, lastName: true, phone: true } },
  agent: { select: { id: true, firstName: true, lastName: true, email: true } },
};

export class SiteVisitRepository {
  async findById(id: string) {
    return prisma.siteVisit.findFirst({
      where: { id, ...softDeleteFilter },
      include: visitInclude,
    });
  }

  async findMany(
    where: Prisma.SiteVisitWhereInput = {},
    skip = 0,
    take = 10,
    orderBy: Prisma.SiteVisitOrderByWithRelationInput = { scheduledAt: 'desc' }
  ) {
    return prisma.siteVisit.findMany({
      where: { ...where, ...softDeleteFilter },
      include: visitInclude,
      skip,
      take,
      orderBy,
    });
  }

  async count(where: Prisma.SiteVisitWhereInput = {}): Promise<number> {
    return prisma.siteVisit.count({ where: { ...where, ...softDeleteFilter } });
  }

  async create(data: Prisma.SiteVisitCreateInput) {
    return prisma.siteVisit.create({ data, include: visitInclude });
  }

  async update(id: string, data: Prisma.SiteVisitUpdateInput) {
    return prisma.siteVisit.update({ where: { id }, data, include: visitInclude });
  }

  async softDelete(id: string) {
    return prisma.siteVisit.update({ where: { id }, data: softDeleteData() });
  }
}

export default new SiteVisitRepository();
