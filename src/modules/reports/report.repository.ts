import prisma from '../../config/database';
import { softDeleteFilter } from '../../common/utils/helpers';
import { LeadStatus, BookingStatus } from '@prisma/client';

export class ReportRepository {
  async getLeadConversionReport(startDate?: Date, endDate?: Date) {
    const dateFilter = {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    };

    const where = {
      ...softDeleteFilter,
      ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
    };

    const [byStatus, bySource, total] = await Promise.all([
      prisma.lead.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.lead.groupBy({
        by: ['sourceId'],
        where,
        _count: true,
      }),
      prisma.lead.count({ where }),
    ]);

    const sources = await prisma.leadSource.findMany({
      where: softDeleteFilter,
      select: { id: true, name: true, type: true },
    });

    const sourceMap = Object.fromEntries(sources.map((s) => [s.id, s]));
    const wonCount = byStatus.find((s) => s.status === LeadStatus.WON)?._count || 0;
    const conversionRate = total > 0 ? ((wonCount / total) * 100).toFixed(2) : '0';

    return {
      total,
      conversionRate: `${conversionRate}%`,
      byStatus,
      bySource: bySource.map((s) => ({
        source: sourceMap[s.sourceId] || { id: s.sourceId },
        count: s._count,
      })),
    };
  }

  async getSalesReport(startDate?: Date, endDate?: Date) {
    const dateFilter = {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    };

    const where = {
      ...softDeleteFilter,
      ...(Object.keys(dateFilter).length && { bookingDate: dateFilter }),
    };

    const [byStatus, totalBookings, revenue] = await Promise.all([
      prisma.booking.groupBy({
        by: ['status'],
        where,
        _count: true,
        _sum: { totalAmount: true, paidAmount: true },
      }),
      prisma.booking.count({ where }),
      prisma.booking.aggregate({
        where: { ...where, status: { not: BookingStatus.CANCELLED } },
        _sum: { totalAmount: true, paidAmount: true },
      }),
    ]);

    return {
      totalBookings,
      totalRevenue: Number(revenue._sum.totalAmount || 0),
      totalCollected: Number(revenue._sum.paidAmount || 0),
      pendingAmount: Number(revenue._sum.totalAmount || 0) - Number(revenue._sum.paidAmount || 0),
      byStatus,
    };
  }

  async getRevenueReport(startDate?: Date, endDate?: Date) {
    const dateFilter = {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    };

    const payments = await prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        ...(Object.keys(dateFilter).length && { paidAt: dateFilter }),
      },
      include: {
        booking: {
          select: { bookingNumber: true, lead: { select: { firstName: true, lastName: true } } },
        },
      },
      orderBy: { paidAt: 'desc' },
    });

    const byMethod = await prisma.payment.groupBy({
      by: ['method'],
      where: {
        status: 'COMPLETED',
        ...(Object.keys(dateFilter).length && { paidAt: dateFilter }),
      },
      _sum: { amount: true },
      _count: true,
    });

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    return { totalRevenue, paymentCount: payments.length, byMethod, recentPayments: payments.slice(0, 20) };
  }

  async getAgentPerformanceReport(startDate?: Date, endDate?: Date) {
    const dateFilter = {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    };

    const agents = await prisma.user.findMany({
      where: { ...softDeleteFilter, isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        _count: {
          select: {
            assignedLeads: {
              where: {
                ...softDeleteFilter,
                ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
              },
            },
            bookings: {
              where: {
                ...softDeleteFilter,
                ...(Object.keys(dateFilter).length && { bookingDate: dateFilter }),
              },
            },
            siteVisits: {
              where: {
                ...softDeleteFilter,
                ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
              },
            },
          },
        },
      },
    });

    const performance = await Promise.all(
      agents.map(async (agent) => {
        const wonLeads = await prisma.lead.count({
          where: {
            assignedToId: agent.id,
            status: LeadStatus.WON,
            ...softDeleteFilter,
            ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
          },
        });

        const revenue = await prisma.booking.aggregate({
          where: {
            agentId: agent.id,
            ...softDeleteFilter,
            status: { not: BookingStatus.CANCELLED },
            ...(Object.keys(dateFilter).length && { bookingDate: dateFilter }),
          },
          _sum: { paidAmount: true },
        });

        return {
          agent: {
            id: agent.id,
            name: `${agent.firstName} ${agent.lastName}`,
            email: agent.email,
          },
          totalLeads: agent._count.assignedLeads,
          wonLeads,
          conversionRate:
            agent._count.assignedLeads > 0
              ? `${((wonLeads / agent._count.assignedLeads) * 100).toFixed(2)}%`
              : '0%',
          totalBookings: agent._count.bookings,
          totalSiteVisits: agent._count.siteVisits,
          revenue: Number(revenue._sum.paidAmount || 0),
        };
      })
    );

    return performance.sort((a, b) => b.revenue - a.revenue);
  }
}

export default new ReportRepository();
