import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import profileRoutes from './profileRoutes.js';
import productRoutes from './productRoutes.js';

export default async function (fastify) {
  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(userRoutes, { prefix: '/users' });
  await fastify.register(profileRoutes, { prefix: '/profile' });
  await fastify.register(productRoutes, { prefix: "/products" });
}