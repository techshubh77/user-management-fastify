const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = [
      {
        id: uuidv4(),
        name: 'Laptop Pro',
        price: 1200.0,
        currency: 'USD',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Wireless Mouse',
        price: 45.5,
        currency: 'USD',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Mechanical Keyboard',
        price: 150.0,
        currency: 'USD',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: '4K Monitor',
        price: 350.99,
        currency: 'USD',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Ergonomic Desk Chair',
        price: 250.0,
        currency: 'USD',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('products', products, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  },
};
