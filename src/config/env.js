import dotenv from "dotenv";
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const config = {
    app_name: process.env.APP_NAME || "User Management System",
    port: process.env.PORT || 3000,
    base_url: process.env.BASE_URL || `http://localhost:${process.env.PORT}`,
    jwt_secret: process.env.JWT_SECRET,
    env: process.env.NODE_ENV || "development",
    allowed_origins: process.env.ALLOWED_ORIGINS,
    db: {
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        user: process.env.DEV_DB_USER,
        name: process.env.DEV_DB_NAME,
        password: process.env.DEV_DB_PASSWORD
    },
    email: {
        providers: {
            mailtrap: {
                host: process.env.MAILTRAP_HOST,
                port: process.env.MAILTRAP_PORT,
                user: process.env.MAILTRAP_USER,
                password: process.env.MAILTRAP_PASSWORD,
                secure: process.env.MAILTRAP_SECURE
            }
        }
    }
}

export default config;