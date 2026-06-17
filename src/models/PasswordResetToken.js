const definePasswordResetToken = (sequelize, DataTypes) => {
  const PasswordResetToken = sequelize.define(
    'PasswordResetToken',
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
    },
    {
      tableName: 'password_reset_tokens',
      timestamps: true,
      updatedAt: false, // only created_at needed
      underscored: true,
      indexes: [
        { unique: true, fields: ['email'] },
        { fields: ['token'] },
        { fields: ['expired_at'] },
      ],
    }
  );

  return PasswordResetToken;
};

export default definePasswordResetToken;
