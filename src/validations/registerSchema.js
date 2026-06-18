export const registerBodySchema = {
  type: 'object',
  required: ['name', 'email', 'password', 'confirmPassword'],
  additionalProperties: false,

  properties: {
    name: {
      type: 'string',
      minLength: 3,
      maxLength: 100,
      pattern: "^[a-zA-Z][a-zA-Z\\s'\\-]{1,98}[a-zA-Z]$",
      errorMessage: {
        type: 'Name must be a string',
        minLength: 'Name must be at least 3 characters',
        maxLength: 'Name must not exceed 100 characters',
        pattern: 'Name must only contain letters, spaces, hyphens, or apostrophes',
      },
    },

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

    avatar: {
      type: 'string',
      maxLength: 50,
      pattern: '^\\d+\\.(jpg|jpeg|png)$',
      errorMessage: {
        pattern: 'Avatar must be a valid image filename',
      },
    },
  },

  errorMessage: {
    required: {
      name: 'Name is required',
      email: 'Email is required',
      password: 'Password is required',
      confirmPassword: 'Confirm password is required',
    },
    additionalProperties: 'Unknown field provided',
  },
};

export const registerRouteSchema = {
  schema: {
    body: registerBodySchema,
    response: {
      201: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          message: { type: 'string' },
          data: { type: 'null' },
        },
      },
    },
  },
};
