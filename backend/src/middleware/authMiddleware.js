/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header
 * Required for protected routes
 */

const jwt = require("jsonwebtoken");

/**
 * Middleware to check JWT token validity
 * Expected header format: Authorization: Bearer <token>
 *
 * If valid: Sets req.user.id and calls next()
 * If invalid: Returns 401 Unauthorized
 */
const authMiddleware = (req, res, next) => {
  // Extract Authorization header
  const authHeader = req.headers.authorization;

  // Check if header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object for use in route handlers
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
