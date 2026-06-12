import { Response } from 'express';
import { PaginatedResult } from '../dto/pagination.dto';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginatedResult<unknown>['meta'];
}

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200): void {
  const response: ApiResponse<T> = { success: true, data };
  if (message) response.message = message;
  res.status(statusCode).json(response);
}

export function sendPaginated<T>(
  res: Response,
  result: PaginatedResult<T>,
  message?: string
): void {
  res.status(200).json({
    success: true,
    message,
    data: result.data,
    meta: result.meta,
  });
}

export function sendCreated<T>(res: Response, data: T, message = 'Created successfully'): void {
  sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}
