import { Request, Response, NextFunction } from 'express';
import { getParam } from '../../common/utils/request.util';
import siteVisitService from './site-visit.service';
import { sendSuccess, sendPaginated, sendCreated, sendNoContent } from '../../common/utils/response.util';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SiteVisitQueryDto } from './dto/site-visit.dto';

export class SiteVisitController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await siteVisitService.findAll({ ...req.query } as PaginationDto & SiteVisitQueryDto);
      sendPaginated(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const visit = await siteVisitService.findById(getParam(req, 'id'));
      sendSuccess(res, visit);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const visit = await siteVisitService.create(req.body);
      sendCreated(res, visit);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const visit = await siteVisitService.update(getParam(req, 'id'), req.body);
      sendSuccess(res, visit);
    } catch (error) {
      next(error);
    }
  }

  async submitFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const visit = await siteVisitService.submitFeedback(getParam(req, 'id'), req.body);
      sendSuccess(res, visit, 'Feedback submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await siteVisitService.delete(getParam(req, 'id'));
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new SiteVisitController();
