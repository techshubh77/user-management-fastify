import STATUS_CODES from '../config/constants.js';
import logger from '../config/logger.js';
import profileService from '../services/profileService.js';
import { successResponse } from '../utils/response.js';
import { t } from '../utils/translator.js';

export const show = async (request, reply) => {
  try {
    const locale = request.locale;

    return successResponse({
      reply,
      statusCode: STATUS_CODES.OK,
      message: t(locale, 'profile.profile_fetch_success'),
      data: { user: request.user.toJSON() },
    });
  } catch (error) {
    logger.error(`show profile error: ${error.message}`);
    throw error;
  }
};

export const update = async (request, reply) => {
  try {
    const locale = request.locale;
    const updatedUser = await profileService.updateProfile(request.user, request.body, locale);

    return successResponse({
      reply,
      statusCode: STATUS_CODES.OK,
      message: t(locale, 'profile.profile_update_success'),
      data: { user: updatedUser.toJSON() },
    });
  } catch (error) {
    logger.error(`update profile error: ${error.message}`);
    throw error;
  }
};

export const changePassword = async (request, reply) => {
  try {
    const locale = request.locale;
    const { oldPassword, newPassword } = request.body;

    await profileService.changePassword(request.user, oldPassword, newPassword, locale);

    return successResponse({
      reply,
      statusCode: STATUS_CODES.OK,
      message: t(locale, 'profile.password_changed_successfully'),
      data: null,
    });
  } catch (error) {
    logger.error(`change password error: ${error.message}`);
    throw error;
  }
};

export const getLoginHistory = async (request, reply) => {
  try {
    const locale = request.locale;
    const timezone = request.timezone;
    const loginHistory = await profileService.getLoginHistory(request.user.id, timezone);

    return successResponse({
      reply,
      statusCode: STATUS_CODES.OK,
      message: t(locale, 'profile.login_history_fetch_success'),
      data: loginHistory,
    });
  } catch (error) {
    logger.error(`get login history error: ${error.message}`);
    throw error;
  }
};
