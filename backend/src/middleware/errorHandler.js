/**
 * Global error handling middleware
 * Must be the last middleware in the chain
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Conflict',
      message: 'Resource already exists',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid reference to related resource'
    });
  }

  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      error: 'Database Error',
      message: 'An error occurred while accessing the database'
    });
  }

  // JWT errors (should be handled in auth middleware, but just in case)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }

  // Custom application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.name || 'Error',
      message: err.message
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
