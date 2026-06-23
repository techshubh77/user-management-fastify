import fs from 'fs';
import path from 'path';

import STATUS_CODES from '../config/constants.js';
import logger from '../config/logger.js';
import AppError from '../utils/appError.js';
import { t } from '../utils/translator.js';
import db from '../models/index.js';

const AVATAR_DIR = path.resolve('uploads/avatars');

const profileService = {
  async updateProfile(user, data, _locale) {
    const { name, avatar, preferred_currency } = data;

    if (name) {
      user.name = name;
    }

    if (avatar) {
      // Delete old avatar if it exists to clean up orphaned files
      if (user.avatar) {
        const oldAvatarPath = path.join(AVATAR_DIR, user.avatar);
        try {
          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
          }
        } catch (error) {
          logger.error(`Failed to delete old avatar file ${user.avatar}: ${error.message}`);
        }
      }
      user.avatar = avatar;
    }

    if (preferred_currency) {
      user.preferred_currency = preferred_currency;
    }

    await user.save();
    return user;
  },

  async changePassword(user, oldPassword, newPassword, locale) {
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      throw new AppError(t(locale, 'profile.invalid_old_password'), STATUS_CODES.BAD_REQUEST);
    }

    user.password = newPassword;
    await user.save();
  },

  async getLoginHistory(userId, timezone) {
    const loginHistory = await db.LoginHistory.findAll({
      where: { user_id: userId },
      order: [['logged_in_at', 'DESC']],
      raw: true,
      nest: true,
    });

    const convertedHistory = loginHistory.map((record) => {
      const loggedInAt = new Date(record.logged_in_at);
      const localLoggedInAt = loggedInAt.toLocaleString('en-US', { timeZone: timezone });

      return {
        ...record,
        logged_in_at: localLoggedInAt,
      };
    });

    return convertedHistory;
  },
};

export default profileService;
