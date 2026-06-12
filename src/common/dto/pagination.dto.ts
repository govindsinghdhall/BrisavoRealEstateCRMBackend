import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function getPaginationParams(dto: PaginationDto) {
  const page = Number(dto.page) || 1;
  const limit = Number(dto.limit) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildSearchFilter(search: string | undefined, fields: string[]) {
  if (!search) return {};

  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: 'insensitive' as const },
    })),
  };
}

export function buildSortOrder(sortBy?: string, sortOrder?: 'asc' | 'desc') {
  return { [sortBy || 'createdAt']: sortOrder || 'desc' };
}
