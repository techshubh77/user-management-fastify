import IOredis from 'ioredis';

import config from './env.js';
import logger from './logger.js';

const connection = new IOredis({
  host: config.redis_host || '127.0.0.1',
  port: Number(config.redis_port) || 6379,
  maxRetriesPerRequest: null,
});

connection.on('connect', () => {
  logger.info('Redis connected');
});

connection.on('error', (err) => {
  logger.error(`Redis error: ${err.message}`);
});

export default connection;
