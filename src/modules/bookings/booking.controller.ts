import { Request, Response, NextFunction } from 'express';
import { getParam } from '../../common/utils/request.util';
import bookingService from './booking.service';
import { sendSuccess, sendPaginated, sendCreated, sendNoContent } from '../../common/utils/response.util';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { BookingQueryDto } from './dto/booking.dto';

export class BookingController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await bookingService.findAll({ ...req.query } as PaginationDto & BookingQueryDto);
      sendPaginated(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await bookingService.findById(getParam(req, 'id'));
      sendSuccess(res, booking);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await bookingService.create(req.body, req.user!.userId, req.user!.organizationId);
      sendCreated(res, booking);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await bookingService.update(getParam(req, 'id'), req.body);
      sendSuccess(res, booking);
    } catch (error) {
      next(error);
    }
  }

  async addPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payment = await bookingService.addPayment(getParam(req, 'id'), req.body);
      sendCreated(res, payment, 'Payment recorded successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await bookingService.delete(getParam(req, 'id'));
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new BookingController();
