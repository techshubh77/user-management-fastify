import crypto from 'crypto';

import jwt from 'jsonwebtoken';

import STATUS_CODES from '../config/constants.js';
import config from '../config/env.js';
import db from '../models/index.js';
import emailQueue from '../queues/emailQueue.js';
import AppError from '../utils/appError.js';

const authService = {
  async register(body) {
    const { name, email, password, avatar } = body;
    const normalizedEmail = email.trim().toLowerCase();

    const exists_user = await db.User.findOne({ where: { email: normalizedEmail } });
    if (exists_user) {
      throw new AppError('Email is already registered', STATUS_CODES.BAD_REQUEST);
    }

    const user = await db.User.create({
      name,
      email,
      password,
      avatar: avatar || null,
    });
    const token = crypto.randomBytes(32).toString('hex');
    const expired_at = new Date(Date.now() + 10 * 60 * 1000);

    await db.EmailVerificationToken.create({
      email: normalizedEmail,
      token,
      expired_at,
    });

    await emailQueue.add('sendVerifyEmail', {
      to: user.email,
      subject: 'Verify Your Email Address',
      templateName: 'verify_email',
      data: {
        name: user.name,
        email: user.email,
        verifyLink: `${config.frontend_url}/auth/verify-email/${token}`,
      },
    });
  },

  async login(data) {
    const { email, password } = data;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await db.User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      throw new AppError('Invalid credentials', STATUS_CODES.BAD_REQUEST);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', STATUS_CODES.BAD_REQUEST);
    }

    if (user.deleted_at) {
      throw new AppError('This account no longer exists.', STATUS_CODES.FORBIDDEN);
    }

    if (!user.is_email_verified) {
      throw new AppError('Your email is not verified.', STATUS_CODES.FORBIDDEN);
    }
    if (!user.is_active) {
      throw new AppError('Your account has been blocked.', STATUS_CODES.FORBIDDEN);
    }
    if (user.is_approved === 0) {
      throw new AppError('Your account is under review.', STATUS_CODES.FORBIDDEN);
    }
    if (user.is_approved === 2) {
      throw new AppError('Your account application has been rejected.', STATUS_CODES.FORBIDDEN);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, config.jwt_secret, {
      expiresIn: '1h',
    });
    return { user: user.toJSON(), token };
  },

  async forgotPassword(email) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await db.User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      // Return silently to prevent email enumeration attacks
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expired_at = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Create or update the token for this email
    await db.PasswordResetToken.upsert({
      email: normalizedEmail,
      token,
      expired_at,
    });

    await emailQueue.add('sendForgotPasswordEmail', {
      to: user.email,
      subject: 'Password Reset Request',
      templateName: 'forgot_password',
      data: {
        name: user.name,
        email: user.email,
        token,
        resetLink: `${config.frontend_url}/auth/reset-password/${token}`,
      },
    });
  },

  async resetPassword(token, newPassword) {
    const Op = db.Sequelize.Op;

    // Find valid token
    const tokenRecord = await db.PasswordResetToken.findOne({
      where: {
        token,
        expired_at: { [Op.gt]: new Date() },
      },
    });

    if (!tokenRecord) {
      throw new AppError('Invalid or expired password reset token', STATUS_CODES.BAD_REQUEST);
    }

    const user = await db.User.findOne({ where: { email: tokenRecord.email } });
    if (!user) {
      throw new AppError('User not found', STATUS_CODES.NOT_FOUND);
    }

    // Update password (beforeSave hook in User model will hash it)
    user.password = newPassword;
    await user.save();

    // Delete the token so it can't be used again
    await tokenRecord.destroy();
  },

  async verifyEmail(token) {
    const Op = db.Sequelize.Op;

    // Find valid token
    const tokenRecord = await db.EmailVerificationToken.findOne({
      where: {
        token,
        expired_at: { [Op.gt]: new Date() },
      },
    });

    if (!tokenRecord) {
      throw new AppError('Invalid or expired verification token', STATUS_CODES.BAD_REQUEST);
    }

    const user = await db.User.findOne({ where: { email: tokenRecord.email } });
    if (!user) {
      throw new AppError('User not found', STATUS_CODES.NOT_FOUND);
    }

    if (user.is_email_verified) {
      throw new AppError('Email is already verified', STATUS_CODES.BAD_REQUEST);
    }

    user.is_email_verified = true;
    await user.save();

    await tokenRecord.destroy();
  },
};

export default authService;
