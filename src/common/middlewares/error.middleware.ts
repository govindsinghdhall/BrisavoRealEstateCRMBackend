import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppError } from '../errors/app.error';
import logger from '../utils/logger';
import config from '../../config';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Image file is too large. Maximum size is 10MB per photo.'
        : err.code === 'LIMIT_FILE_COUNT'
          ? 'Too many files. You can upload up to 20 photos at a time.'
          : err.message;
    res.status(400).json({ success: false, message });
    return;
  }

  if (err.message?.includes('Only image files are allowed')) {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    message: config.env === 'production' ? 'Internal server error' : err.message,
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
}
