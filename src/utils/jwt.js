const jwt = require('jsonwebtoken');
require('dotenv').config();

const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
});

module.exports = { signToken };
