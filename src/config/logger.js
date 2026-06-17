import path from 'path';

const logPath = path.join(process.cwd(), 'application.log');

const loggerConfig = {
  level: 'info',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: 'info',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
      {
        target: 'pino-pretty',
        level: 'info',
        options: {
          colorize: false,
          translateTime: 'yyyy-mm-dd HH:MM:ss.l o',
          ignore: 'pid,hostname',
          destination: logPath,
          mkdir: true,
        },
      },
    ],
  },
};

export default loggerConfig;

