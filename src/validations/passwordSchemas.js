export const forgotPasswordBodySchema = {
  type: 'object',
  required: ['email'],
  additionalProperties: false,

  properties: {
    email: {
      type: 'string',
      format: 'email',
      maxLength: 150,
      errorMessage: {
        type: 'Email must be a string',
        format: 'Must be a valid email address',
        maxLength: 'Email must not exceed 150 characters',
      },
    },
  },

  errorMessage: {
    required: {
      email: 'Email is required',
    },
    additionalProperties: 'Unknown field provided',
  },
};

export const resetPasswordBodySchema = {
  type: 'object',
  required: ['token', 'password', 'confirmPassword'],
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
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 16,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,16}$',
      errorMessage: {
        type: 'Password must be a string',
        minLength: 'Password must be at least 8 characters',
        maxLength: 'Password must not exceed 16 characters',
        pattern: 'Password must contain uppercase, lowercase, a number, and a special character',
      },
    },
    confirmPassword: {
      type: 'string',
      minLength: 8,
      maxLength: 16,
      errorMessage: {
        minLength: 'Confirm password must be at least 8 characters',
        maxLength: 'Confirm password must not exceed 16 characters',
      },
    },
  },

  errorMessage: {
    required: {
      token: 'Token is required',
      password: 'Password is required',
      confirmPassword: 'Confirm password is required',
    },
    additionalProperties: 'Unknown field provided',
  },
};
