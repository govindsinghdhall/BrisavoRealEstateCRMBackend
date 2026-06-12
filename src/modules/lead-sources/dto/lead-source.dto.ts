import { IsNotEmpty, IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { LeadSourceType } from '@prisma/client';

export class CreateLeadSourceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(LeadSourceType)
  type!: LeadSourceType;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateLeadSourceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(LeadSourceType)
  type?: LeadSourceType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
