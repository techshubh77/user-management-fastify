export const changePasswordSchema = {
  type: 'object',
  required: ['oldPassword', 'newPassword', 'confirmPassword'],
  additionalProperties: false,
  properties: {
    oldPassword: {
      type: 'string',
      minLength: 8,
      maxLength: 16,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,16}$',
      errorMessage: {
        minLength: 'Old password must be at least 8 characters',
        maxLength: 'Old password must not exceed 16 characters',
        pattern:
          'Old password must contain uppercase, lowercase, a number, and a special character',
      },
    },
    newPassword: {
      type: 'string',
      minLength: 8,
      maxLength: 16,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,16}$',
      errorMessage: {
        minLength: 'New password must be at least 8 characters',
        maxLength: 'New password must not exceed 16 characters',
        pattern:
          'New password must contain uppercase, lowercase, a number, and a special character',
      },
    },
    confirmPassword: {
      type: 'string',
      minLength: 8,
      maxLength: 16,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,16}$',
      errorMessage: {
        minLength: 'Confirm new password must be at least 8 characters',
        maxLength: 'Confirm new password must not exceed 16 characters',
        pattern:
          'Confirm new password must contain uppercase, lowercase, a number, and a special character',
      },
    },
  },
  oneOf: [
    {
      properties: {
        newPassword: { const: { $data: '1/confirmPassword' } },
      },
      errorMessage: {
        oneOf: 'New password and confirm password do not match',
      },
    },
  ],
  errorMessage: {
    required: {
      oldPassword: 'Old password is required',
      newPassword: 'New password is required',
      confirmPassword: 'Confirm password is required',
    },
    additionalProperties: 'Unknown field provided',
  },
};
