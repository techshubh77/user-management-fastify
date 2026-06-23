'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'preferred_currency', {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'preferred_currency');
  },
};

