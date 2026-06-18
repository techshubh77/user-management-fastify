import { Queue } from 'bullmq';

import connection from '../config/redis.js';

const emailQueue = new Queue('emailQueue', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export default emailQueue;
