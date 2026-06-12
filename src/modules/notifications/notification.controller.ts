import { Request, Response, NextFunction } from 'express';
import notificationService from './notification.service';
import { sendSuccess, sendPaginated, sendCreated } from '../../common/utils/response.util';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class NotificationController {
  async send(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notification = await notificationService.send(req.body, req.user!.organizationId);
      sendCreated(res, notification, 'Notification queued successfully');
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await notificationService.findAll(req.query as unknown as PaginationDto);
      sendPaginated(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
