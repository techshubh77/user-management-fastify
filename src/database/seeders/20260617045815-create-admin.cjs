'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Admin@1234', 10);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: uuidv4(),
          name: 'Admin Bhai',
          email: 'admin@gmail.com',
          password: hashedPassword,
          role: 'admin',
          avatar: null,
          is_email_verified: true,
          is_approved: 1,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ],
      {
        fields: [
          'id',
          'name',
          'email',
          'password',
          'role',
          'avatar',
          'is_email_verified',
          'is_approved',
          'is_active',
          'created_at',
          'updated_at',
          'deleted_at',
        ],
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
