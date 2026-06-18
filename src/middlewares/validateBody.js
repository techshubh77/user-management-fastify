import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import ajvFormats from 'ajv-formats';

import STATUS_CODES from '../config/constants.js';
import AppError from '../utils/appError.js';

// Build AJV once at module level (not on every request)
const ajv = new Ajv({ allErrors: true, coerceTypes: false });
ajvErrors(ajv);
ajvFormats(ajv);

/**
 * Returns a Fastify preHandler that validates request.body against the given schema.
 * Works with multipart routes because it runs AFTER the upload middleware.
 *
 * @param {object} schema - A JSON Schema object
 * @returns {Function} Fastify preHandler hook
 */
export const validateBody = (schema) => {
  const validate = ajv.compile(schema); // compiled once per schema at startup

  return async (request, _reply) => {
    const valid = validate(request.body);

    if (!valid) {
      const errors = validate.errors.map((e) => ({
        field: e.instancePath.replace('/', '') || e.params?.missingProperty,
        message: e.message,
      }));

      throw new AppError('Validation failed', STATUS_CODES.UNPROCESSABLE_ENTITY, { errors });
    }
  };
};

export const validateParams = (schema) => {
  const validate = ajv.compile(schema); 

  return async (request, _reply) => {
    const valid = validate(request.params);

    if (!valid) {
      const errors = validate.errors.map((e) => ({
        field: e.instancePath.replace('/', '') || e.params?.missingProperty,
        message: e.message,
      }));

      throw new AppError('Validation failed', STATUS_CODES.UNPROCESSABLE_ENTITY, { errors });
    }
  };
};
