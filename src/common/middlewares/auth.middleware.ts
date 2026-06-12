import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { UnauthorizedError, ForbiddenError } from '../errors/app.error';
import prisma from '../../config/database';
import { requireTenant } from './tenant.middleware';

export interface JwtPayload {
  userId: string;
  email: string;
  roleId: string;
  organizationId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        permissions: string[];
        roleName: string;
        organizationSlug?: string;
      };
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;

    const user = await prisma.user.findFirst({
      where: { id: decoded.userId, isActive: true, deletedAt: null },
      include: {
        organization: { select: { id: true, slug: true, status: true } },
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found or inactive');
    }

    req.user = {
      ...decoded,
      organizationId: user.organizationId,
      organizationSlug: user.organization.slug,
      roleName: user.role.name,
      permissions: user.role.permissions.map((rp) => rp.permission.name),
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid or expired token'));
    } else {
      next(error);
    }
  }
}

export function authorize(...permissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }

    const hasPermission = permissions.some((p) => req.user!.permissions.includes(p));

    if (!hasPermission) {
      next(new ForbiddenError('Insufficient permissions'));
      return;
    }

    next();
  };
}

export function authorizeAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new UnauthorizedError());
    return;
  }

  if (req.user.roleName.toLowerCase() !== 'admin') {
    next(new ForbiddenError('Only administrators can perform this action'));
    return;
  }

  next();
}

/** Authenticate JWT + verify active organization (use on all tenant-scoped routes) */
export const protect = [authenticate, requireTenant];

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  authenticate(req, _res, next).catch(next);
}
