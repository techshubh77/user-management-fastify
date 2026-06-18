import AppError from '../utils/appError.js';
import { errorResponse } from '../utils/response.js';
import STATUS_CODES from '../config/constants.js';

const isDevelopment = process.env.NODE_ENV === 'development';

const normalizeError = (error) => {
  // Our own operational errors (AppError)
  if (error.isOperational || error instanceof AppError) {
    return {
      statusCode: error.statusCode || STATUS_CODES.BAD_REQUEST,
      message: error.message,
      isOperational: true,
    };
  }

  // Fastify native errors (e.g. FST_INVALID_MULTIPART_CONTENT_TYPE, FST_ERR_*)
  // They have a numeric statusCode but no isOperational flag.
  if (error.statusCode && error.statusCode < 500) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      isOperational: true,
    };
  }

  // Unknown / programming errors — mask in production
  return {
    statusCode: STATUS_CODES.SERVER_ERROR,
    message: isDevelopment ? error.message : 'Something went wrong',
    isOperational: false,
  };
};

const errorHandler = (error, request, reply) => {
  const normalizedError = normalizeError(error);

  request.log.error({
    message: normalizedError.message,
    statusCode: normalizedError.statusCode,
    method: request.method,
    url: request.url,
  });

  if (isDevelopment && error.stack) {
    request.log.error(error.stack);
  }

  return errorResponse({
    reply,
    statusCode: normalizedError.statusCode,
    message: normalizedError.message,
    errors: normalizedError.isOperational ? error.errors : null,
  });
};

export default errorHandler;
