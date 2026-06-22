import { UAParser } from 'ua-parser-js';

import STATUS_CODES from '../config/constants.js';
import config from '../config/env.js';
import authService from '../services/authService.js';
import AppError from '../utils/appError.js';
import { successResponse } from '../utils/response.js';
import { t } from '../utils/translator.js';

export const register = async (request, reply) => {
  try {
    const { body } = request;
    const locale = request.locale;
    if (body.password !== body.confirmPassword) {
      throw new AppError(t(locale, 'auth.passwords_do_not_match'), STATUS_CODES.BAD_REQUEST);
    }

    await authService.register(body, locale);

    return successResponse({
      reply,
      statusCode: STATUS_CODES.CREATED,
      message: t(locale, 'auth.register_success'),
    });
  } catch (error) {
    request.log.error(`register error: ${error.message}`);
    throw error;
  }
};

export const login = async (request, reply) => {
  try {
    const locale = request.locale;
    const userAgent = request.headers['user-agent'] || '';
    const parser = new UAParser(userAgent);
    const uaResult = parser.getResult();

    const res = await authService.login(request, locale, uaResult);
    reply.setCookie('token', res.token, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: 1 * 60 * 60, // 1 hour
      path: '/',
    });

    return successResponse({
      reply,
      statusCode: STATUS_CODES.OK,
      message: t(locale, 'auth.login_success'),
      data: res.user,
    });
  } catch (error) {
    request.log.error(`login error: ${error.message}`);
    throw error;
  }
};

export const forgotPassword = async (request, reply) => {
  try {
    const { email } = request.body;
    const locale = request.locale;

    await authService.forgotPassword(email, locale);

    return successResponse({
      reply,
      statusCode: STATUS_CODES.OK,
      message: t(locale, 'auth.forgot_password_success'),
    });
  } catch (error) {
    request.log.error(`forgotPassword error: ${error.message}`);
    throw error;
  }
};

export const resetPassword = async (request, reply) => {
  try {
    const { token, password, confirmPassword } = request.body;
    const locale = request.locale;
    if (password !== confirmPassword) {
      throw new AppError(t(locale, 'auth.passwords_do_not_match'), STATUS_CODES.BAD_REQUEST);
    }

    await authService.resetPassword(token, password, locale);

    return successResponse({
      reply,
      statusCode: STATUS_CODES.OK,
      message: t(locale, 'auth.reset_password_success'),
    });
  } catch (error) {
    request.log.error(`resetPassword error: ${error.message}`);
    throw error;
  }
};

export const verifyEmail = async (request, reply) => {
  try {
    const { token } = request.params;
    const locale = request.locale;

    await authService.verifyEmail(token, locale);

    return successResponse({
      reply,
      statusCode: STATUS_CODES.OK,
      message: t(locale, 'auth.verify_email_success'),
    });
  } catch (error) {
    request.log.error(`verifyEmail error: ${error.message}`);
    throw error;
  }
};
