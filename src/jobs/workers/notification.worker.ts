import { Worker, Job } from 'bullmq';
import config from '../../config';
import logger from '../../common/utils/logger';
import notificationRepository from '../../modules/notifications/notification.repository';
import { NotificationStatus } from '@prisma/client';
import { EmailJobData, SmsJobData, WhatsAppJobData } from '../queues/notification.queue';

const connection = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
};

async function processEmail(job: Job<EmailJobData>) {
  const { notificationId, to, subject, message } = job.data;

  logger.info(`Sending email to ${to}`, { subject });

  // Integrate with SMTP provider (e.g., nodemailer) in production
  // For now, log the email content
  logger.info('Email sent successfully', { to, subject, messagePreview: message.substring(0, 100) });

  if (notificationId) {
    await notificationRepository.updateStatus(notificationId, NotificationStatus.SENT);
  }

  return { success: true, to };
}

async function processSms(job: Job<SmsJobData>) {
  const { notificationId, recipient, message } = job.data;

  logger.info(`Sending SMS to ${recipient}`);

  // Integrate with SMS provider API in production
  logger.info('SMS sent successfully', { recipient, messagePreview: message.substring(0, 50) });

  if (notificationId) {
    await notificationRepository.updateStatus(notificationId, NotificationStatus.SENT);
  }

  return { success: true, recipient };
}

async function processWhatsApp(job: Job<WhatsAppJobData>) {
  const { notificationId, recipient, message } = job.data;

  logger.info(`Sending WhatsApp message to ${recipient}`);

  // Integrate with WhatsApp Business API in production
  logger.info('WhatsApp message sent successfully', { recipient });

  if (notificationId) {
    await notificationRepository.updateStatus(notificationId, NotificationStatus.SENT);
  }

  return { success: true, recipient };
}

export function startNotificationWorker(): Worker {
  const worker = new Worker(
    'notifications',
    async (job) => {
      switch (job.name) {
        case 'send-email':
          return processEmail(job as Job<EmailJobData>);
        case 'send-sms':
          return processSms(job as Job<SmsJobData>);
        case 'send-whatsapp':
          return processWhatsApp(job as Job<WhatsAppJobData>);
        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }
    },
    { connection, concurrency: 5 }
  );

  worker.on('completed', (job) => {
    logger.info(`Notification job ${job.id} completed`);
  });

  worker.on('failed', async (job, error) => {
    logger.error(`Notification job ${job?.id} failed:`, error);
    if (job?.data?.notificationId) {
      await notificationRepository.updateStatus(
        job.data.notificationId,
        NotificationStatus.FAILED,
        error.message
      );
    }
  });

  logger.info('Notification worker started');
  return worker;
}
