import { IsNotEmpty, IsOptional, IsString, IsUUID, IsEnum, IsDateString, IsInt, Min, Max } from 'class-validator';
import { VisitStatus } from '@prisma/client';

export class CreateSiteVisitDto {
  @IsDateString()
  @IsNotEmpty()
  scheduledAt!: string;

  @IsUUID()
  @IsNotEmpty()
  leadId!: string;

  @IsUUID()
  @IsNotEmpty()
  agentId!: string;

  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateSiteVisitDto {
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(VisitStatus)
  status?: VisitStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class VisitFeedbackDto {
  @IsString()
  @IsNotEmpty()
  feedback!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}

export class SiteVisitQueryDto {
  @IsOptional()
  @IsEnum(VisitStatus)
  status?: VisitStatus;

  @IsOptional()
  @IsUUID()
  agentId?: string;

  @IsOptional()
  @IsUUID()
  leadId?: string;
}
