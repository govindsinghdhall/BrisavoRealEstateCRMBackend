import Redis from 'ioredis';
import config from './index';
import logger from '../common/utils/logger';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      maxRetriesPerRequest: null,
      lazyConnect: true,
      retryStrategy: () => null,
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redisClient.on('error', (error) => {
      if (config.env === 'development') {
        logger.warn('Redis connection error:', error.message);
      } else {
        logger.error('Redis connection error:', error);
      }
    });
  }

  return redisClient;
}

export async function checkRedisConnection(): Promise<boolean> {
  const client = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    maxRetriesPerRequest: 1,
    connectTimeout: 2000,
    lazyConnect: true,
    retryStrategy: () => null,
  });

  try {
    await Promise.race([
      (async () => {
        await client.connect();
        await client.ping();
        return true;
      })(),
      new Promise<boolean>((_, reject) =>
        setTimeout(() => reject(new Error('Redis connection timeout')), 2500)
      ),
    ]);
    return true;
  } catch {
    return false;
  } finally {
    client.disconnect();
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis disconnected');
  }
}

export default getRedisClient;
