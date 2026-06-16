import app from "./app.js";
import config from "./config/env.js";

const startServer = async () => {
    try {
        await app.listen({
            host: "0.0.0.0",
            port: Number(config.port) || 3000
        });

        app.log.info(`Server started running on port ${config.port || 3000}`);
    } catch (error) {
        app.log.error(error);

        process.exit(1);
    }
};

startServer();