/**
 * Custom Logger Middleware
 * Logs all incoming HTTP requests with method and URL
 */

/**
 * Logger middleware function
 * Logs request details: method, url, timestamp
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Pass control to next middleware
};

module.exports = logger;
