export const verifyEmailParamsSchema = {
  type: 'object',
  required: ['token'],
  additionalProperties: false,
  properties: {
    token: {
      type: 'string',
      minLength: 1,
      errorMessage: {
        type: 'Token must be a string',
        minLength: 'Token cannot be empty',
      },
    },
  },
  errorMessage: {
    required: {
      token: 'Token is required',
    },
    additionalProperties: 'Unknown field provided',
  },
};
