import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError as ClassValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationError } from '../errors/app.error';

export function validateDto<T extends object>(dtoClass: new () => T, source: 'body' | 'query' = 'body') {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToInstance(dtoClass, req[source], {
        enableImplicitConversion: true,
        excludeExtraneousValues: false,
      });

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        const formattedErrors = formatValidationErrors(errors);
        throw new ValidationError('Validation failed', formattedErrors);
      }

      req[source] = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
}

function formatValidationErrors(errors: ClassValidationError[]): unknown[] {
  return errors.flatMap((error) => {
    if (error.constraints) {
      return Object.values(error.constraints).map((message) => ({
        field: error.property,
        message,
      }));
    }
    if (error.children && error.children.length > 0) {
      return formatValidationErrors(error.children).map((child: unknown) => ({
        ...(child as Record<string, unknown>),
        field: `${error.property}.${(child as Record<string, unknown>).field}`,
      }));
    }
    return [];
  });
}
