import AppError from "../utils/appError.js";
import { errorResponse } from "../utils/response.js";

const isDevelopment =
    process.env.NODE_ENV === "development";

const normalizeError = (error) => {

    if (
        error.isOperational ||
        error instanceof AppError
    ) {
        return {
            statusCode:
                error.statusCode || 400,

            message:
                error.message,

            isOperational: true,
        };
    }

    return {
        statusCode: 500,

        message: isDevelopment
            ? error.message
            : "Something went wrong",

        isOperational: false,
    };
};

const errorHandler = (
    error,
    request,
    reply
) => {

    const normalizedError =
        normalizeError(error);

    request.log.error({
        message:
            normalizedError.message,

        statusCode:
            normalizedError.statusCode,

        method:
            request.method,

        url:
            request.url,
    });

    if (
        isDevelopment &&
        error.stack
    ) {
        request.log.error(error.stack);
    }

    return errorResponse({
        reply,

        statusCode:
            normalizedError.statusCode,

        message:
            normalizedError.message,

        errors:
            normalizedError.isOperational
                ? error.errors
                : null,
    });
};

export default errorHandler;