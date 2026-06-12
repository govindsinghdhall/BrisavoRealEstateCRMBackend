import app from './app';
import config from './config';
import { connectDatabase, disconnectDatabase } from './config/database';
import { checkRedisConnection, disconnectRedis } from './config/redis';
import { startNotificationWorker } from './jobs/workers/notification.worker';
import logger from './common/utils/logger';
import { Worker } from 'bullmq';

let notificationWorker: Worker | undefined;

async function bootstrap() {
  try {
    await connectDatabase();

    const redisAvailable = await checkRedisConnection();
    if (redisAvailable) {
      notificationWorker = startNotificationWorker();
    } else if (config.env === 'development') {
      logger.warn(
        'Redis is not available. Notification queue is disabled. Start Redis with: docker compose up -d redis'
      );
    } else {
      throw new Error('Redis is required in production. Start Redis and retry.');
    }

    const server = app.listen(config.port, () => {
      logger.info(`${config.appName} server running on port ${config.port}`);
      logger.info(`Environment: ${config.env}`);
      logger.info(`API: http://localhost:${config.port}${config.apiPrefix}`);
      logger.info(`Swagger: http://localhost:${config.port}/api-docs`);
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        if (notificationWorker) {
          await notificationWorker.close();
          logger.info('Notification worker closed');
        }

        await disconnectDatabase();
        await disconnectRedis();

        logger.info('Graceful shutdown completed');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    logger.error(
      'Setup help: 1) Start Docker Desktop  2) Run: docker compose up -d postgres redis  3) Run: npm run prisma:migrate && npm run prisma:seed  4) Update DATABASE_URL in .env if using local PostgreSQL'
    );
    process.exit(1);
  }
}

bootstrap();
