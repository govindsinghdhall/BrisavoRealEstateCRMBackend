import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsNumber,
  IsArray,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PropertyType,
  PropertyStatus,
  ListingCategory,
  PropertyAge,
  Furnishing,
  Facing,
  PossessionStatus,
} from '@prisma/client';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ListingCategory)
  listingCategory!: ListingCategory;

  @IsEnum(PropertyType)
  type!: PropertyType;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  area!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  carpetArea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  builtUpArea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  superArea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bathrooms?: number;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsString()
  @IsNotEmpty()
  locality!: string;

  @IsOptional()
  @IsString()
  sector?: string;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  builderName?: string;

  @IsOptional()
  @IsEnum(PropertyAge)
  propertyAge?: PropertyAge;

  @IsOptional()
  @IsEnum(Furnishing)
  furnishing?: Furnishing;

  @IsOptional()
  @IsEnum(Facing)
  facing?: Facing;

  @IsOptional()
  @IsEnum(PossessionStatus)
  possessionStatus?: PossessionStatus;

  @IsOptional()
  @IsString()
  possessionDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  roiPotential?: number;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  hasRera?: boolean;

  @IsOptional()
  @IsString()
  reraId?: string;

  @IsOptional()
  @IsString()
  videoTourUrl?: string;

  @IsOptional()
  @IsString()
  virtualTourUrl?: string;

  @IsOptional()
  @IsString()
  brochureUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsUUID()
  projectId?: string;
}

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ListingCategory)
  listingCategory?: ListingCategory;

  @IsOptional()
  @IsEnum(PropertyType)
  type?: PropertyType;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  area?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  carpetArea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  builtUpArea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  superArea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsString()
  locality?: string;

  @IsOptional()
  @IsString()
  sector?: string;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  builderName?: string;

  @IsOptional()
  @IsEnum(PropertyAge)
  propertyAge?: PropertyAge;

  @IsOptional()
  @IsEnum(Furnishing)
  furnishing?: Furnishing;

  @IsOptional()
  @IsEnum(Facing)
  facing?: Facing;

  @IsOptional()
  @IsEnum(PossessionStatus)
  possessionStatus?: PossessionStatus;

  @IsOptional()
  @IsString()
  possessionDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  roiPotential?: number;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  hasRera?: boolean;

  @IsOptional()
  @IsString()
  reraId?: string;

  @IsOptional()
  @IsString()
  videoTourUrl?: string;

  @IsOptional()
  @IsString()
  virtualTourUrl?: string;

  @IsOptional()
  @IsString()
  brochureUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsUUID()
  projectId?: string;
}

export class PropertyQueryDto {
  @IsOptional()
  @IsEnum(PropertyType)
  type?: PropertyType;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsOptional()
  @IsEnum(ListingCategory)
  listingCategory?: ListingCategory;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  locality?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;
}
