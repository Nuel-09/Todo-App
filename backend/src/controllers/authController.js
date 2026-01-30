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

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // ✅ No manual hashing here — handled by User.js pre-save hook
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed", details: err.message });
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
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
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
      userId: user._id
    });
  } catch (err) {
    res.status(400).json({ error: "Login failed", details: err.message });
  }
};
