const { errorResponse } = require('../utils/apiResponse');

const errorMiddleware = (err, req, res, next) => {
  if (err.name === 'ZodError') {
    return errorResponse(res, 'Validation error', 400, err.errors);
  }

  return errorResponse(res, err.message || 'Internal server error', err.statusCode || 500);
};

module.exports = errorMiddleware;
