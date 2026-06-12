import { Prisma, NotificationType, NotificationStatus } from '@prisma/client';
import prisma from '../../config/database';

export class NotificationRepository {
  async create(data: Prisma.NotificationCreateInput) {
    return prisma.notification.create({ data });
  }

  async findMany(skip = 0, take = 10, type?: NotificationType) {
    return prisma.notification.findMany({
      where: type ? { type } : {},
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(type?: NotificationType): Promise<number> {
    return prisma.notification.count({ where: type ? { type } : {} });
  }

  async updateStatus(id: string, status: NotificationStatus, error?: string) {
    return prisma.notification.update({
      where: { id },
      data: {
        status,
        sentAt: status === NotificationStatus.SENT ? new Date() : undefined,
        error,
      },
    });
  }
}

export default new NotificationRepository();
