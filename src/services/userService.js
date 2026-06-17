import db from '../models/index.js';

const userService = {
  async index() {
    return await db.User.findAll();
  },

  async create(data) {
    return await db.User.create(data);
  },
};

export default userService;
