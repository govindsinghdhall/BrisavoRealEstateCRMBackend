import reportRepository from './report.repository';
import { IsOptional, IsDateString } from 'class-validator';

export class ReportQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class ReportService {
  async getLeadConversion(query: ReportQueryDto) {
    return reportRepository.getLeadConversionReport(
      query.startDate ? new Date(query.startDate) : undefined,
      query.endDate ? new Date(query.endDate) : undefined
    );
  }

  async getSalesReport(query: ReportQueryDto) {
    return reportRepository.getSalesReport(
      query.startDate ? new Date(query.startDate) : undefined,
      query.endDate ? new Date(query.endDate) : undefined
    );
  }

  async getRevenueReport(query: ReportQueryDto) {
    return reportRepository.getRevenueReport(
      query.startDate ? new Date(query.startDate) : undefined,
      query.endDate ? new Date(query.endDate) : undefined
    );
  }

  async getAgentPerformance(query: ReportQueryDto) {
    return reportRepository.getAgentPerformanceReport(
      query.startDate ? new Date(query.startDate) : undefined,
      query.endDate ? new Date(query.endDate) : undefined
    );
  }
}

export default new ReportService();
