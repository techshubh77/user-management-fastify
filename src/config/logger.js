import path from "path";

const logPath = path.join(
    process.cwd(),
    "application.log"
);

const loggerConfig = {
    level: "info",

    transport: {
        targets: [
            {
                target: "pino-pretty",
                level: "info",
                options: {
                    colorize: true,
                    translateTime: "HH:MM:ss",
                    ignore: "pid,hostname"
                }
            },
            {
                target: "pino/file",
                level: "info",
                options: {
                    destination: logPath,
                    mkdir: true
                }
            }
        ]
    }
};

export default loggerConfig;