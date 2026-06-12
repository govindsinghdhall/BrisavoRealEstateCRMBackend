import { Request, Response, NextFunction } from 'express';
import config from '../../config';
import { UnauthorizedError } from '../errors/app.error';

export function websiteApiKey(req: Request, _res: Response, next: NextFunction): void {
  const configuredKey = config.website.apiKey;

  if (!configuredKey) {
    next();
    return;
  }

  const providedKey = req.headers['x-website-api-key'];

  if (!providedKey || providedKey !== configuredKey) {
    next(new UnauthorizedError('Invalid website API key'));
    return;
  }

  next();
}
