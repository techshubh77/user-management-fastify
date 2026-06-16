import fp from "fastify-plugin";
import fastifyPostgres from "@fastify/postgres";
import config from "../config/env.js";

async function dbConnector(fastify, options) {
    const connectionString = `postgres://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.name}`;

    await fastify.register(fastifyPostgres, {
        connectionString: connectionString
    });

    fastify.addHook("onReady", async () => {
        try {
            const client = await fastify.pg.connect();

            fastify.log.info(`Database connected successfully to: ${config.db.name} on ${config.db.host}`);

            client.release();
        } catch (error) {
            fastify.log.error("Database connection failed!");
            fastify.log.error(error);
            process.exit(1);
        }
    });
}

export default fp(dbConnector);
