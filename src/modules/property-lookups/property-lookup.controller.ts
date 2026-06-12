import { Request, Response, NextFunction } from 'express';
import propertyLookupService from './property-lookup.service';
import { sendCreated, sendSuccess } from '../../common/utils/response.util';
import { PropertyLookupQueryDto } from './dto/property-lookup.dto';

export class PropertyLookupController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type } = req.query as unknown as PropertyLookupQueryDto;
      const data = await propertyLookupService.findAll(req.user!.organizationId, type);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lookup = await propertyLookupService.create(req.body, req.user!.organizationId);
      sendCreated(res, lookup);
    } catch (error) {
      next(error);
    }
  }
}

export default new PropertyLookupController();
