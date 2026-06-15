const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { errorResponse } = require('../utils/apiResponse');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error) {
    return errorResponse(res, 'Invalid token', 401);
  }
};

module.exports = authMiddleware;
