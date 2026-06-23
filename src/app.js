import multipart from '@fastify/multipart';
import Fastify from 'fastify';

import STATUS_CODES from './config/constants.js';
import logger from './config/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import compressPlugin from './plugins/compress.js';
import cookiePlugin from './plugins/cookie.js';
import corsPlugin from './plugins/cors.js';
import dbPlugin from './plugins/database.js';
import helmetPlugin from './plugins/helmet.js';
import languageDetectorPlugin from './plugins/languageDetector.js';
import rateLimitPlugin from './plugins/rateLimit.js';
import routes from './routes/index.js';
import { t } from './utils/translator.js';

import './workers/emailWorker.js';
import { startCurrencyCron } from "./workers/currencyWorker.js"

startCurrencyCron();

const app = Fastify({
  loggerInstance: logger,
  trustProxy: true,
  disableRequestLogging: false,
  forceCloseConnections: true,
});

app.setErrorHandler(errorHandler);

app.register(dbPlugin);
app.register(corsPlugin);
app.register(helmetPlugin);
app.register(cookiePlugin);
app.register(compressPlugin);
app.register(rateLimitPlugin);
app.register(languageDetectorPlugin);

app.register(multipart);

app.register(routes, {
  prefix: '/api/v1',
});

app.setNotFoundHandler(async (request, reply) => {
  const locale = request.locale || 'en';
  return reply.status(404).send({
    status: 'error',
    message: t(locale, 'general.route_not_found', { url: request.url }),
    statusCode: STATUS_CODES.NOT_FOUND,
  });
});

export default app;
