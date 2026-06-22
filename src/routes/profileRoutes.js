import * as ProfileController from '../controllers/profileController.js';
import authenticate from '../middlewares/auth.js';
import uploadAvatar from '../middlewares/upload.js';
import { validateBody } from '../middlewares/validateBody.js';
import { changePasswordSchema } from '../validations/changePasswordSchema.js';
import { updateProfileSchema } from '../validations/updateProfileSchema.js';

export default async function profileRoutes(fastify, _opts) {
  fastify.get(
    '/',
    {
      preHandler: [authenticate],
    },
    ProfileController.show
  );
  fastify.patch(
    '/',
    {
      preHandler: [authenticate, uploadAvatar, validateBody(updateProfileSchema)],
    },
    ProfileController.update
  );
  fastify.patch(
    '/change-password',
    {
      preHandler: [authenticate, validateBody(changePasswordSchema)],
    },
    ProfileController.changePassword
  );
  fastify.get(
    '/login-history',
    {
      preHandler: [authenticate],
    },
    ProfileController.getLoginHistory
  );
}
