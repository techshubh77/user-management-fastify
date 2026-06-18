import bcrypt from 'bcrypt';

const defineUser = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
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

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
      },

      avatar: {
        type: DataTypes.STRING(20),
      },

      is_email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      is_approved: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
        validate: {
          isIn: [[0, 1, 2]],
        },
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      deleted_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [{ unique: true, fields: ['email'] }],
    }
  );

  //  Password hashing
  User.beforeSave(async (user) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  // Hide password
  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return User;
};

export default defineUser;
