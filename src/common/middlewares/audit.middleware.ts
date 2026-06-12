import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';

export async function auditLog(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const originalJson = res.json.bind(res);

  res.json = function (responseBody: unknown) {
    if (req.user && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const entity = req.path.split('/').filter(Boolean)[0] || 'unknown';
      const parsedBody = responseBody as Record<string, unknown> | undefined;
      const entityId =
        req.params.id ||
        (parsedBody?.data as Record<string, unknown> | undefined)?.id ||
        'unknown';

      prisma.auditLog
        .create({
          data: {
            action: `${req.method} ${req.path}`,
            entity,
            entityId: String(entityId),
            newValues: req.method !== 'DELETE' ? (req.body as object) : undefined,
            organizationId: req.user.organizationId,
            userId: req.user.userId,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
          },
        })
        .catch(() => {});
    }

    return originalJson(responseBody);
  };

  next();
}

export async function createAuditLog(data: {
  action: string;
  entity: string;
  entityId: string;
  organizationId: string;
  oldValues?: object;
  newValues?: object;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  await prisma.auditLog.create({ data });
}
