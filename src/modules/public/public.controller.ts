import { Request, Response, NextFunction } from 'express';
import publicService from './public.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../common/utils/response.util';

export class PublicController {
  async getProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await publicService.getProperties(req.query as never);
      sendPaginated(res, result, 'Properties retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getPropertyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const property = await publicService.getPropertyById(String(req.params.id));
      sendSuccess(res, property);
    } catch (error) {
      next(error);
    }
  }

  async submitInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await publicService.submitInquiry(req.body);
      sendCreated(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }
}

export default new PublicController();
