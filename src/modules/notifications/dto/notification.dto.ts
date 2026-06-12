import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { NotificationType } from '@prisma/client';

export class SendNotificationDto {
  @IsEnum(NotificationType)
  type!: NotificationType;

  @IsString()
  @IsNotEmpty()
  recipient!: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  @IsNotEmpty()
  message!: string;
}
