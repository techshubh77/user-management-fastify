import * as ProductController from '../controllers/productController.js';
import authenticate from '../middlewares/auth.js';

export default async function productRoutes(fastify, _opts) {
    fastify.get(
        '/',
        {
            preHandler: [authenticate],
        },
        ProductController.getProducts
    );
}
