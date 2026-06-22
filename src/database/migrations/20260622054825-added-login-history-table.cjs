'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('login_histories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      logged_in_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      browser: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      os: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      device: {
        type: Sequelize.ENUM('Desktop', 'Mobile', 'Tablet', 'Unknown'),
        allowNull: false,
      },

      timezone: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    });

    // Index for fetching a user's login history
    await queryInterface.addIndex('login_histories', ['user_id'], {
      name: 'idx_login_histories_user_id',
    });

    // Index for sorting/filtering by login time
    await queryInterface.addIndex('login_histories', ['logged_in_at'], {
      name: 'idx_login_histories_logged_in_at',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('login_histories', 'idx_login_histories_user_id');

    await queryInterface.removeIndex('login_histories', 'idx_login_histories_logged_in_at');

    await queryInterface.dropTable('login_histories');

    // Required for PostgreSQL only
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_login_histories_device";');
    }
  },
};
