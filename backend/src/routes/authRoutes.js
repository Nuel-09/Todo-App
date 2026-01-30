/**
 * Authentication Routes
 * Handles user registration and login endpoints
 */

const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 * Body: { fullName: string, email: string, password: string }
 * Response: { message: string }
 */
router.post("/register", register);

/**
 * POST /api/auth/login
 * Login user with either email or fullName
 * Body: { usernameOrEmail: string, password: string }
 * Response: { token: string, userId: string }
 */
router.post("/login", login);

module.exports = router;
