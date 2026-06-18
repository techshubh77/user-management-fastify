import { Worker } from 'bullmq';

import logger from '../config/logger.js';
import connection from '../config/redis.js';
import sendEmail from '../utils/email.js';
import getEmailHtml from '../utils/emailTemplate.js';

const worker = new Worker(
  'emailQueue',
  async (job) => {
    const { templateName, data, to, subject } = job.data;

    const html = await getEmailHtml(templateName, data);

    await sendEmail({
      to,
      subject,
      html,
    });

    return true;
  },
  {
    connection,
    concurrency: 5,
  }
);

// Events
worker.on('completed', (job) => {
  logger.info(`Email job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  logger.error(`Email job ${job?.id} failed: ${err.message}, ${err}`);
});

export default worker;
