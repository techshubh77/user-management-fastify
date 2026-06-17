import * as UserController from '../controllers/userController.js';
import uploadAvatar from '../middlewares/upload.js';

export default async function userRoutes(fastify, _opts) {
  fastify.get('/', UserController.index);
  fastify.post('/', { preHandler: [uploadAvatar] }, UserController.create);
}
