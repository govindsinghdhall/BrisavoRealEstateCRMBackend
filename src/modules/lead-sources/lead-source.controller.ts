import { Request, Response, NextFunction } from 'express';
import { getParam } from '../../common/utils/request.util';
import leadSourceService from './lead-source.service';
import { sendSuccess, sendPaginated, sendCreated, sendNoContent } from '../../common/utils/response.util';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class LeadSourceController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await leadSourceService.findAll(req.query as unknown as PaginationDto);
      sendPaginated(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const source = await leadSourceService.findById(getParam(req, 'id'));
      sendSuccess(res, source);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const source = await leadSourceService.create(req.body, req.user!.organizationId);
      sendCreated(res, source);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const source = await leadSourceService.update(getParam(req, 'id'), req.body);
      sendSuccess(res, source);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await leadSourceService.delete(getParam(req, 'id'));
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new LeadSourceController();
