import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PropertyLookupTypeEnum } from '../property-lookup.constants';

export class PropertyLookupQueryDto {
  @IsOptional()
  @IsEnum(PropertyLookupTypeEnum)
  type?: PropertyLookupTypeEnum;
}

export class CreatePropertyLookupDto {
  @IsEnum(PropertyLookupTypeEnum)
  type!: PropertyLookupTypeEnum;

  @IsString()
  @IsNotEmpty()
  value!: string;
}
