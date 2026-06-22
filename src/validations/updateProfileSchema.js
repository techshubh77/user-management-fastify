export const updateProfileSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
      maxLength: 100,
      pattern: "^[a-zA-Z][a-zA-Z\\s'\\-]{1,98}[a-zA-Z]$",
      errorMessage: {
        type: 'Name is required',
        minLength: 'Name must be at least 3 characters',
        maxLength: 'Name must not exceed 100 characters',
        pattern: 'Name must only contain letters, spaces, hyphens, or apostrophes',
      },
    },
    avatar: {
      type: 'string',
      maxLength: 50,
      pattern: '^\\d+\\.(jpg|jpeg|png)$',
      errorMessage: {
        maxLength: 'Avatar filename must not exceed 50 characters',
        pattern: 'Avatar filename must be a valid image filename',
      },
    },
  },
  additionalProperties: false,
  errorMessage: {
    additionalProperties: 'Unknown field provided',
  },
};
