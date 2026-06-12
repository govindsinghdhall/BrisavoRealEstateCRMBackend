import { IsEmail, IsObject, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  logo?: string | null;

  @IsOptional()
  @ValidateIf((_o, value) => value !== null && value !== '')
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string | null;

  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown> | null;
}
