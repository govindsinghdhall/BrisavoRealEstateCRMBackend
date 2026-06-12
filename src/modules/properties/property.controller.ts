import { Request, Response, NextFunction } from 'express';
import { getParam } from '../../common/utils/request.util';
import propertyService from './property.service';
import { sendSuccess, sendPaginated, sendCreated, sendNoContent } from '../../common/utils/response.util';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PropertyQueryDto } from './dto/property.dto';

export class PropertyController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await propertyService.findAll({ ...req.query } as PaginationDto & PropertyQueryDto);
      sendPaginated(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const property = await propertyService.findById(getParam(req, 'id'));
      sendSuccess(res, property);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const property = await propertyService.create(req.body, req.user!.organizationId);
      sendCreated(res, property);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const property = await propertyService.update(getParam(req, 'id'), req.body);
      sendSuccess(res, property, 'Property updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await propertyService.delete(getParam(req, 'id'));
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded. Please select a valid image file.' });
        return;
      }
      const image = await propertyService.uploadImage(
        getParam(req, 'id'),
        req.file.filename,
        req.body.caption,
        req.body.isPrimary === 'true'
      );
      sendCreated(res, image, 'Image uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  async uploadImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files?.length) {
        res.status(400).json({ success: false, message: 'No files uploaded. Please select valid image files.' });
        return;
      }
      const images = await propertyService.uploadImages(
        getParam(req, 'id'),
        files.map((file) => file.filename),
        req.body.setPrimary === 'true'
      );
      sendCreated(res, images, `${images.length} image(s) uploaded successfully`);
    } catch (error) {
      next(error);
    }
  }

  async uploadBrochure(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }
      const property = await propertyService.uploadBrochure(getParam(req, 'id'), req.file.filename);
      sendSuccess(res, property, 'Brochure uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  async getInventory(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inventory = await propertyService.getInventory();
      sendSuccess(res, inventory);
    } catch (error) {
      next(error);
    }
  }
}

export default new PropertyController();
