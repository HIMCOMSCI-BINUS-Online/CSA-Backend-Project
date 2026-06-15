const { User } = require('../models');

const findByEmail = (email) => User.findOne({ where: { email } });
const findByUsername = (username) => User.findOne({ where: { username } });
const findById = (id) => User.findByPk(id);
const createUser = (payload) => User.create(payload);

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  createUser,
};
