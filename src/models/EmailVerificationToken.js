import { DataTypes } from 'sequelize';

const defineEmailVerificationToken = (sequelize) => {
  const EmailVerificationToken = sequelize.define(
    'EmailVerificationToken',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        set(value) {
          this.setDataValue('email', value.toLowerCase());
        },
      },

      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      expired_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'email_verification_tokens',
      timestamps: false,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
        {
          fields: ['token'],
        },
        {
          fields: ['expired_at'],
        },
      ],
    }
  );

  return EmailVerificationToken;
};

export default defineEmailVerificationToken;
