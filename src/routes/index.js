import userRoutes from './userRoutes.js';

export default async function (fastify) {
  await fastify.register(userRoutes, {
    prefix: '/users',
  });
}
