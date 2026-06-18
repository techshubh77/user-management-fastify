import authService from '../services/authService.js';
import STATUS_CODES from '../config/constants.js';
import AppError from '../utils/appError.js';
import { successResponse } from '../utils/response.js';
import config from '../config/env.js';

export const register = async (request, reply) => {
  try {
    // avatar filename is already in body.avatar — set by uploadAvatar preHandler
    const { body } = request;

    if (body.password !== body.confirmPassword) {
      throw new AppError('Passwords do not match.', STATUS_CODES.BAD_REQUEST);
    }

    await authService.register(body);

    return successResponse({
      reply,
      statusCode: STATUS_CODES.CREATED,
      message:
        'you are registered successfully!. Verification link is sent to your email. Please verify your email to login.',
    });
  } catch (error) {
    request.log.error(`register error: ${error.message}`);
    throw error;
  }
};

export const login = async (request, reply) => {
  try {
    const res = await authService.login(request.body);

    reply.setCookie('token', res.token, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: 1 * 60 * 60, // 1 hour
    });

    return successResponse({
      reply,
      statusCode: STATUS_CODES.OK,
      message: 'Logged in successfully.',
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

    await authService.forgotPassword(email);

    return successResponse({
      reply,
      statusCode: STATUS_CODES.OK,
      message: 'If the email exists, a reset link has been sent.',
    });
  } catch (error) {
    request.log.error(`forgotPassword error: ${error.message}`);
    throw error;
  }
};

export const resetPassword = async (request, reply) => {
  try {
    const { token, password, confirmPassword } = request.body;

    if (password !== confirmPassword) {
      throw new AppError('Passwords do not match.', STATUS_CODES.BAD_REQUEST);
    }

    await authService.resetPassword(token, password);

    return successResponse({
      reply,
      statusCode: STATUS_CODES.OK,
      message: 'Password has been reset successfully. You can now login.',
    });
  } catch (error) {
    request.log.error(`resetPassword error: ${error.message}`);
    throw error;
  }
};

export const verifyEmail = async (request, reply) => {
  try {
    const { token } = request.params;

    await authService.verifyEmail(token);

    return successResponse({
      reply,
      statusCode: STATUS_CODES.OK,
      message: 'Email has been successfully verified. You can now login.',
    });
  } catch (error) {
    request.log.error(`verifyEmail error: ${error.message}`);
    throw error;
  }
};
