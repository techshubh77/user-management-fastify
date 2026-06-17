'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('email_verification_tokens', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      token: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      expired_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes defined in model config
    await queryInterface.addIndex('email_verification_tokens', ['token']);
    await queryInterface.addIndex('email_verification_tokens', ['expired_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('email_verification_tokens');
  },
};
