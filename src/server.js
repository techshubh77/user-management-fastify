import { execSync } from 'node:child_process';

import app from './app.js';
import config from './config/env.js';

const PORT = parseInt(config.port, 10) || 4000;
let isShuttingDown = false;

/**
 * Central Shutdown Handler
 */
const shutdown = async (reason, error = null) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  try {
    if (error) {
      console.error(reason, error);
      app.log.error(reason);
      app.log.error(error.stack || error);
    } else {
      app.log.info(reason);
    }

    // Closing the app gracefully stops the HTTP server and runs onClose hooks (which disconnects DB)
    await app.close();

    app.log.info('Shutdown complete');
    process.exit(error ? 1 : 0);
  } catch (err) {
    console.error('FORCED SHUTDOWN', err);
    process.exit(1);
  }
};

/**
 * Global Exception Handlers
 */
process.on('uncaughtException', (error) => {
  shutdown('UNCAUGHT EXCEPTION! Shutting down...', error);
});

process.on('unhandledRejection', (reason) => {
  shutdown('UNHANDLED REJECTION! Shutting down...', reason);
});

/**
 * Graceful Shutdown Signals
 */
process.on('SIGTERM', () => shutdown('SIGTERM RECEIVED'));
process.on('SIGINT', () => shutdown('SIGINT RECEIVED'));
process.on('SIGUSR2', () => shutdown('NODEMON RESTART RECEIVED'));

/**
 * Ensure the port is free before attempting to listen.
 * Kills any orphaned process still holding the port (e.g. lingering
 * pino worker threads from a previous restart).
 */
const ensurePortFree = (port) => {
  try {
    execSync(`fuser -k ${port}/tcp 2>/dev/null`, { stdio: 'ignore' });
    // Give the OS a moment to release the socket
    execSync('sleep 0.3');
    console.log(`Cleared orphaned process on port ${port}`);
  } catch {
    // fuser returns non-zero if nothing was on the port - that's fine
  }
};

/**
 * Server Start Logic
 */
const startServer = async () => {
  try {
    ensurePortFree(PORT);
    await app.listen({ port: PORT, host: '127.0.0.1' });
    app.log.info(`Server running on port ${PORT}`);
    app.log.info(`Environment: ${config.env}`);
    app.log.info(`Application Name: ${config.app_name}`);
  } catch (error) {
    await shutdown('Failed to start server', error);
  }
};

startServer();

