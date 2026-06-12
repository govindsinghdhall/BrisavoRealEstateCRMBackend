import bookingRepository from './booking.repository';
import { CreateBookingDto, UpdateBookingDto, CreatePaymentDto, BookingQueryDto } from './dto/booking.dto';
import {
  PaginationDto,
  buildPaginationMeta,
  getPaginationParams,
  buildSortOrder,
  PaginatedResult,
} from '../../common/dto/pagination.dto';
import { NotFoundError, BadRequestError } from '../../common/errors/app.error';
import { generateBookingNumber } from '../../common/utils/helpers';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import leadRepository from '../leads/lead.repository';

export class BookingService {
  async findAll(query: PaginationDto & BookingQueryDto): Promise<PaginatedResult<unknown>> {
    const { page, limit, skip } = getPaginationParams(query);

    const where = {
      ...(query.status && { status: query.status }),
      ...(query.agentId && { agentId: query.agentId }),
      ...(query.leadId && { leadId: query.leadId }),
    };

    const [bookings, total] = await Promise.all([
      bookingRepository.findMany(where, skip, limit, buildSortOrder(query.sortBy, query.sortOrder)),
      bookingRepository.count(where),
    ]);

    return { data: bookings, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string) {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new NotFoundError('Booking not found');
    return booking;
  }

  async create(dto: CreateBookingDto, agentId: string, organizationId: string) {
    const booking = await bookingRepository.create({
      organization: { connect: { id: organizationId } },
      bookingNumber: generateBookingNumber(),
      totalAmount: dto.totalAmount,
      notes: dto.notes,
      lead: { connect: { id: dto.leadId } },
      agent: { connect: { id: agentId } },
      ...(dto.unitId && { unit: { connect: { id: dto.unitId } } }),
      ...(dto.propertyId && { property: { connect: { id: dto.propertyId } } }),
    });

    await leadRepository.createTimelineEntry({
      action: 'BOOKING_CREATED',
      description: `Booking ${booking.bookingNumber} created`,
      metadata: { bookingId: booking.id, amount: dto.totalAmount },
      lead: { connect: { id: dto.leadId } },
      performedBy: { connect: { id: agentId } },
    });

    return booking;
  }

  async update(id: string, dto: UpdateBookingDto) {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new NotFoundError('Booking not found');
    return bookingRepository.update(id, dto);
  }

  async addPayment(bookingId: string, dto: CreatePaymentDto) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    const payment = await bookingRepository.createPayment({
      amount: dto.amount,
      method: dto.method,
      status: PaymentStatus.COMPLETED,
      transactionId: dto.transactionId,
      reference: dto.reference,
      notes: dto.notes,
      paidAt: new Date(),
      booking: { connect: { id: bookingId } },
    });

    const totalPaid = await bookingRepository.getTotalPaidAmount(bookingId);
    let status: BookingStatus = BookingStatus.CONFIRMED;

    if (totalPaid >= Number(booking.totalAmount)) {
      status = BookingStatus.FULLY_PAID;
    } else if (totalPaid > 0) {
      status = BookingStatus.PARTIALLY_PAID;
    }

    await bookingRepository.update(bookingId, {
      paidAmount: totalPaid,
      status,
    });

    return payment;
  }

  async delete(id: string): Promise<void> {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new NotFoundError('Booking not found');
    await bookingRepository.softDelete(id);
  }
}

export default new BookingService();
