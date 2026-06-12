import notificationRepository from './notification.repository';
import { SendNotificationDto } from './dto/notification.dto';
import { notificationQueue } from '../../jobs/queues/notification.queue';
import { PaginationDto, buildPaginationMeta, getPaginationParams, PaginatedResult } from '../../common/dto/pagination.dto';
import { NotificationType } from '@prisma/client';

export class NotificationService {
  async send(dto: SendNotificationDto, organizationId: string) {
    const notification = await notificationRepository.create({
      organization: { connect: { id: organizationId } },
      type: dto.type,
      recipient: dto.recipient,
      subject: dto.subject,
      message: dto.message,
    });

    const jobName =
      dto.type === NotificationType.EMAIL
        ? 'send-email'
        : dto.type === NotificationType.SMS
          ? 'send-sms'
          : 'send-whatsapp';

    await notificationQueue.add(jobName, {
      notificationId: notification.id,
      recipient: dto.recipient,
      subject: dto.subject,
      message: dto.message,
    });

    return notification;
  }

  async findAll(query: PaginationDto & { type?: NotificationType }): Promise<PaginatedResult<unknown>> {
    const { page, limit, skip } = getPaginationParams(query);
    const [notifications, total] = await Promise.all([
      notificationRepository.findMany(skip, limit, query.type),
      notificationRepository.count(query.type),
    ]);
    return { data: notifications, meta: buildPaginationMeta(total, page, limit) };
  }
}

export default new NotificationService();
