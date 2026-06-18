import nodemailer from 'nodemailer';

import config from '../config/env.js';
import logger from '../config/logger.js';

import AppError from './appError.js';

// Transporter is created lazily (inside sendEmail) so it always reads
// config values after dotenv has fully initialised. If created at module
// load time it can capture undefined values when the module is imported
// early (e.g. via emailWorker -> app.js) before dotenv runs.
const createTransporter = () =>
  nodemailer.createTransport({
    host: config.email.providers.mailtrap.host,
    port: Number(config.email.providers.mailtrap.port),
    secure: String(config.email.providers.mailtrap.secure) === 'true',
    auth: {
      user: config.email.providers.mailtrap.user,
      pass: config.email.providers.mailtrap.password,
    },
  });

const sendEmail = async ({ to, subject, html, text = '' }) => {
  if (!to || !subject || !html) {
    throw new AppError('sendEmail requires to, subject and html');
  }

  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: config.email.from,
    to,
    subject,
    html,
    text,
  });

  logger.info(`Email sent to ${to}. MessageId: ${info.messageId}`);
  return info;
};

export default sendEmail;
