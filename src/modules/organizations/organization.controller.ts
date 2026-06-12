import { Request, Response, NextFunction } from 'express';
import organizationService from './organization.service';
import { BadRequestError } from '../../common/errors/app.error';

export class OrganizationController {
  async getCurrent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await organizationService.getCurrent(req.user!.organizationId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async updateCurrent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await organizationService.updateCurrent(req.user!.organizationId, req.body);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async uploadLogo(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new BadRequestError('Logo file is required');
      }
      const logoPath = `/uploads/organizations/${req.file.filename}`;
      const data = await organizationService.updateLogo(req.user!.organizationId, logoPath);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async uploadFavicon(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new BadRequestError('Favicon file is required');
      }
      const faviconPath = `/uploads/organizations/${req.file.filename}`;
      const data = await organizationService.updateFavicon(req.user!.organizationId, faviconPath);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrganizationController();
