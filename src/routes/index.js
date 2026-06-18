import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';

export default async function (fastify) {
  await fastify.register(authRoutes,  { prefix: '/auth' });
  await fastify.register(userRoutes, { prefix: '/users' });
}
