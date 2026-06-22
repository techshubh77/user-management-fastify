import jwt from 'jsonwebtoken';

import STATUS_CODES from '../config/constants.js';
import config from '../config/env.js';
import logger from '../config/logger.js';
import db from '../models/index.js';
import AppError from '../utils/appError.js';
import { t } from '../utils/translator.js';

const authenticate = async (request, _reply) => {
  const token = request.cookies?.token || request.headers.authorization?.replace('Bearer ', '');
  logger.info(`token: ${JSON.stringify(request.cookies)}`);
  if (!token) {
    throw new AppError(t(request.locale, 'auth_error.unauthorized'), STATUS_CODES.UNAUTHORIZED);
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.jwt_secret);
  } catch (error) {
    logger.error(`jwt verification error: ${error.message}`);
    throw new AppError(t(request.locale, 'auth_error.invalid_token'), STATUS_CODES.UNAUTHORIZED);
  }

  const user = await db.User.findByPk(decodedToken.id);
  if (!user) {
    throw new AppError(t(request.locale, 'auth_error.user_not_found'), STATUS_CODES.UNAUTHORIZED);
  }
  request.user = user;
};

export default authenticate;
