import { Request, Response, NextFunction } from 'express';
import { getParam } from '../../common/utils/request.util';
import leadService from './lead.service';
import { sendSuccess, sendPaginated, sendCreated, sendNoContent } from '../../common/utils/response.util';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { LeadQueryDto } from './dto/lead.dto';

export class LeadController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await leadService.findAll(
        { ...req.query } as PaginationDto & LeadQueryDto,
        req.user!.organizationId
      );
      sendPaginated(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await leadService.findById(getParam(req, 'id'));
      sendSuccess(res, lead);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await leadService.create(req.body, req.user!.userId, req.user!.organizationId);
      sendCreated(res, lead);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await leadService.update(getParam(req, 'id'), req.body, req.user!.userId);
      sendSuccess(res, lead, 'Lead updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async assign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await leadService.assign(getParam(req, 'id'), req.body, req.user!.userId);
      sendSuccess(res, lead, 'Lead assigned successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await leadService.delete(getParam(req, 'id'));
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async addNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const note = await leadService.addNote(getParam(req, 'id'), req.body, req.user!.userId);
      sendCreated(res, note);
    } catch (error) {
      next(error);
    }
  }

  async getTimeline(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const timeline = await leadService.getTimeline(getParam(req, 'id'));
      sendSuccess(res, timeline);
    } catch (error) {
      next(error);
    }
  }
}

export default new LeadController();
