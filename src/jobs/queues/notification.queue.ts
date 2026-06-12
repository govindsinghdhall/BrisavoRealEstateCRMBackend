import { Queue } from 'bullmq';
import config from '../../config';

const connection = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
};

export const notificationQueue = new Queue('notifications', { connection });

export interface EmailJobData {
  notificationId?: string;
  to: string;
  subject?: string;
  message: string;
  template?: string;
  data?: Record<string, unknown>;
}

export interface SmsJobData {
  notificationId?: string;
  recipient: string;
  message: string;
}

export interface WhatsAppJobData {
  notificationId?: string;
  recipient: string;
  message: string;
}
