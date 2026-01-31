/**
 * Authentication Controller
 * Handles user registration and login
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Register a new user
 * POST /api/auth/register
 * Body: { username: string, email: string, password: string }
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "All fields (username, email, password) are required.",
      });
    }
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email." });
    }
    // ✅ No manual hashing here — handled by User.js pre-save hook
    const newUser = new User({ username, email, password });
    await newUser.save();
    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({
      message: "Registration successful",
      token,
      userId: newUser._id,
      user: {
        username: newUser.username,
        email: newUser.email,
        _id: newUser._id,
      },
    });
  } catch (err) {
    // Mongoose validation errors
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation failed", details: err.errors });
    }
    // Duplicate key error (unique email)
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already in use." });
    }
    res
      .status(500)
      .json({ error: "Registration failed", details: err.message });
  }
};

/**
 * Login user and return JWT token + userId
 * POST /api/auth/login
 * Body: { usernameOrEmail: string, password: string }
 */
exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // Find user by username OR email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Verify password using model method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (err) {
    res.status(400).json({ error: "Login failed", details: err.message });
  }
};
