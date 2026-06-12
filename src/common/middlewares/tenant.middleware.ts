import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../errors/app.error';
import prisma from '../../config/database';
import { OrganizationStatus } from '@prisma/client';

/**
 * Ensures the authenticated user belongs to an active organization.
 * Attach after authenticate middleware.
 */
export async function requireTenant(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user?.organizationId) {
      throw new UnauthorizedError('Organization context required');
    }

    const organization = await prisma.organization.findFirst({
      where: {
        id: req.user.organizationId,
        deletedAt: null,
        status: { in: [OrganizationStatus.ACTIVE, OrganizationStatus.TRIAL] },
      },
    });

    if (!organization) {
      throw new ForbiddenError('Organization is inactive or suspended');
    }

    next();
  } catch (error) {
    next(error);
  }
}
