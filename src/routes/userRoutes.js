import * as UserController from "../controllers/userController.js";

export default async function userRoutes(fastify, options) {

    fastify.get("/", UserController.index);
    fastify.post("/", UserController.create);

}   