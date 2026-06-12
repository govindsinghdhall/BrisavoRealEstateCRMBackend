import { Request, Response, NextFunction } from 'express';
import reportService, { ReportQueryDto } from './report.service';
import { sendSuccess } from '../../common/utils/response.util';

export class ReportController {
  async leadConversion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await reportService.getLeadConversion(req.query as unknown as ReportQueryDto);
      sendSuccess(res, report);
    } catch (error) {
      next(error);
    }
  }

  async salesReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await reportService.getSalesReport(req.query as unknown as ReportQueryDto);
      sendSuccess(res, report);
    } catch (error) {
      next(error);
    }
  }

  async revenueReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await reportService.getRevenueReport(req.query as unknown as ReportQueryDto);
      sendSuccess(res, report);
    } catch (error) {
      next(error);
    }
  }

  async agentPerformance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await reportService.getAgentPerformance(req.query as unknown as ReportQueryDto);
      sendSuccess(res, report);
    } catch (error) {
      next(error);
    }
  }
}

export default new ReportController();
