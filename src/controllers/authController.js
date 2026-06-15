const authService = require('../services/authService');
const { successResponse } = require('../utils/apiResponse');

const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    return successResponse(res, 'Sign up success', result, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, 'Login success', result);
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => successResponse(res, 'Current user', req.user);

module.exports = {
  signup,
  login,
  me,
};
