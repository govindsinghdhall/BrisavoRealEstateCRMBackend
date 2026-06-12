import { Prisma } from '@prisma/client';
import prisma from '../../config/database';
import { softDeleteFilter, softDeleteData } from '../../common/utils/helpers';

const bookingInclude = {
  lead: { select: { id: true, firstName: true, lastName: true, phone: true } },
  property: { select: { id: true, title: true, city: true, price: true } },
  unit: { select: { id: true, unitNumber: true, type: true, price: true } },
  agent: { select: { id: true, firstName: true, lastName: true } },
  payments: { orderBy: { createdAt: 'desc' as const } },
};

export class BookingRepository {
  async findById(id: string) {
    return prisma.booking.findFirst({
      where: { id, ...softDeleteFilter },
      include: bookingInclude,
    });
  }

  async findMany(
    where: Prisma.BookingWhereInput = {},
    skip = 0,
    take = 10,
    orderBy: Prisma.BookingOrderByWithRelationInput = { createdAt: 'desc' }
  ) {
    return prisma.booking.findMany({
      where: { ...where, ...softDeleteFilter },
      include: bookingInclude,
      skip,
      take,
      orderBy,
    });
  }

  async count(where: Prisma.BookingWhereInput = {}): Promise<number> {
    return prisma.booking.count({ where: { ...where, ...softDeleteFilter } });
  }

  async create(data: Prisma.BookingCreateInput) {
    return prisma.booking.create({ data, include: bookingInclude });
  }

  async update(id: string, data: Prisma.BookingUpdateInput) {
    return prisma.booking.update({ where: { id }, data, include: bookingInclude });
  }

  async softDelete(id: string) {
    return prisma.booking.update({ where: { id }, data: softDeleteData() });
  }

  async createPayment(data: Prisma.PaymentCreateInput) {
    return prisma.payment.create({ data });
  }

  async getTotalPaidAmount(bookingId: string): Promise<number> {
    const result = await prisma.payment.aggregate({
      where: { bookingId, status: 'COMPLETED' },
      _sum: { amount: true },
    });
    return Number(result._sum.amount || 0);
  }
}

export default new BookingRepository();
