/**
 * Global Error Handler Middleware
 * Catches all errors from routes and logs them
 * Must be placed last in middleware stack
 */

/**
 * Error handler middleware
 * Logs error stack trace and returns generic 500 error message to client
 *
 * Note: Express requires 4 parameters (err, req, res, next) for error handling
 */
const errorHandler = (err, req, res, next) => {
  // Log error details to console for debugging
  console.error(err.stack);

  // Send generic error response to client
  res.status(500).json({ error: "Something went wrong!" });
};

module.exports = errorHandler;
