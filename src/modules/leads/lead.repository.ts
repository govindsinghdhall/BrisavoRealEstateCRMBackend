import { Prisma } from '@prisma/client';
import prisma from '../../config/database';
import { softDeleteFilter, softDeleteData } from '../../common/utils/helpers';

const leadInclude = {
  source: true,
  assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
  createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
  property: { select: { id: true, title: true, city: true } },
  project: { select: { id: true, name: true, city: true } },
  _count: { select: { notes: true, siteVisits: true, bookings: true } },
};

export class LeadRepository {
  async findById(id: string) {
    return prisma.lead.findFirst({
      where: { id, ...softDeleteFilter },
      include: {
        ...leadInclude,
        notes: {
          where: softDeleteFilter,
          include: { createdBy: { select: { id: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
        timeline: {
          include: { performedBy: { select: { id: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findMany(
    where: Prisma.LeadWhereInput = {},
    skip = 0,
    take = 10,
    orderBy: Prisma.LeadOrderByWithRelationInput = { createdAt: 'desc' }
  ) {
    return prisma.lead.findMany({
      where: { ...where, ...softDeleteFilter },
      include: leadInclude,
      skip,
      take,
      orderBy,
    });
  }

  async count(where: Prisma.LeadWhereInput = {}): Promise<number> {
    return prisma.lead.count({ where: { ...where, ...softDeleteFilter } });
  }

  async create(data: Prisma.LeadCreateInput) {
    return prisma.lead.create({ data, include: leadInclude });
  }

  async update(id: string, data: Prisma.LeadUpdateInput) {
    return prisma.lead.update({ where: { id }, data, include: leadInclude });
  }

  async softDelete(id: string) {
    return prisma.lead.update({ where: { id }, data: softDeleteData() });
  }

  async createNote(data: Prisma.LeadNoteCreateInput) {
    return prisma.leadNote.create({
      data,
      include: { createdBy: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async createTimelineEntry(data: Prisma.LeadTimelineCreateInput) {
    return prisma.leadTimeline.create({ data });
  }

  async getTimeline(leadId: string) {
    return prisma.leadTimeline.findMany({
      where: { leadId },
      include: { performedBy: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new LeadRepository();
