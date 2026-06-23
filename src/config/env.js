import path from 'path';

import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
  app_name: process.env.APP_NAME || 'User Management System',
  port: process.env.PORT || 4000,
  base_url: process.env.BASE_URL || `http://localhost:${process.env.PORT}`,
  jwt_secret: process.env.JWT_SECRET,
  env: process.env.NODE_ENV || 'development',
  allowed_origins: process.env.ALLOWED_ORIGINS,
  redis_port: process.env.REDIS_PORT,
  frontend_url: process.env.FRONTEND_URL,
  currency_api_key: process.env.CURRENCY_API_KEY,

  db: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    user: process.env.DEV_DB_USER,
    name: process.env.DEV_DB_NAME,
    password: process.env.DEV_DB_PASSWORD,
  },
  email: {
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    providers: {
      mailtrap: {
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        user: process.env.MAILTRAP_USER,
        password: process.env.MAILTRAP_PASSWORD,
        secure: process.env.MAILTRAP_SECURE,
      },
    },
  },
};

export default config;
