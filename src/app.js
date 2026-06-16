import Fastify from "fastify";
import loggerConfig from "./config/logger.js";

import corsPlugin from "./plugins/cors.js";
import helmetPlugin from "./plugins/helmet.js";
import cookiePlugin from "./plugins/cookie.js";
import compressPlugin from "./plugins/compress.js";
import rateLimitPlugin from "./plugins/rateLimit.js";
import dbPlugin from "./plugins/database.js";

import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = Fastify({
    logger: loggerConfig,
    trustProxy: true,
    disableRequestLogging: false,
});

app.setErrorHandler(errorHandler);

await app.register(dbPlugin);
await app.register(corsPlugin);
await app.register(helmetPlugin);
await app.register(cookiePlugin);
await app.register(compressPlugin);
await app.register(rateLimitPlugin);

await app.register(routes, {
    prefix: "/api/v1"
});

app.setNotFoundHandler(async (request, reply) => {
    return reply.status(404).send({
        success: false,
        message: "Route not found!"
    });
});


export default app;


