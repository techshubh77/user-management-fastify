import * as AuthController from '../controllers/authController.js';
import uploadAvatar from '../middlewares/upload.js';
import { validateBody, validateParams } from '../middlewares/validateBody.js';
import { registerBodySchema } from '../validations/registerSchema.js';
import { forgotPasswordBodySchema, resetPasswordBodySchema } from '../validations/passwordSchemas.js';
import { verifyEmailParamsSchema } from '../validations/verifyEmailSchema.js';

export default async function authRoutes(fastify, _opts) {
  fastify.post(
    '/register',
    {
      preHandler: [uploadAvatar, validateBody(registerBodySchema)],
    },
    AuthController.register
  );

  fastify.post('/login', AuthController.login);

  fastify.post(
    '/forgot-password',
    {
      preHandler: [validateBody(forgotPasswordBodySchema)],
    },
    AuthController.forgotPassword
  );

  fastify.post(
    '/reset-password',
    {
      preHandler: [validateBody(resetPasswordBodySchema)],
    },
    AuthController.resetPassword
  );

  fastify.post(
    '/verify-email/:token',
    {
      preHandler: [validateParams(verifyEmailParamsSchema)],
    },
    AuthController.verifyEmail
  );
}
