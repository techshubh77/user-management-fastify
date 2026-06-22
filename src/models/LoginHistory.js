const defineLoginHistory = (sequelize, DataTypes) => {
  const LoginHistory = sequelize.define(
    'LoginHistory',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      logged_in_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      browser: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      os: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      device: {
        type: DataTypes.ENUM('Desktop', 'Mobile', 'Tablet', 'Unknown'),
        allowNull: false,
      },

      timezone: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      tableName: 'login_histories',
      timestamps: false,

      indexes: [
        {
          fields: ['user_id'],
        },
        {
          fields: ['logged_in_at'],
        },
      ],
    }
  );

  LoginHistory.associate = (models) => {
    LoginHistory.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return LoginHistory;
};

export default defineLoginHistory;
