import multipart from '@fastify/multipart';
import Fastify from 'fastify';

import STATUS_CODES from './config/constants.js';
import loggerConfig from './config/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import compressPlugin from './plugins/compress.js';
import cookiePlugin from './plugins/cookie.js';
import corsPlugin from './plugins/cors.js';
import dbPlugin from './plugins/database.js';
import helmetPlugin from './plugins/helmet.js';
import rateLimitPlugin from './plugins/rateLimit.js';
import routes from './routes/index.js';

const app = Fastify({
  logger: loggerConfig,
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

app.register(multipart);

app.register(routes, {
  prefix: '/api/v1',
});

app.setNotFoundHandler(async (request, reply) => {
  return reply.status(404).send({
    status: 'error',
    message: 'Route not found!',
    statusCode: STATUS_CODES.NOT_FOUND,
  });
});

export default app;
