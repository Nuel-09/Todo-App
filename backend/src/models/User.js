/**
 * User Model
 * Defines the User schema and methods for authentication
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

/**
 * Pre-save hook: Hash password before storing in database
 * Only hashes if password field was modified (not on every save)
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Instance method: Compare candidate password with hashed password
 * Used during login to verify password is correct
 *
 * @param {string} candidatePassword - Plain text password from login form
 * @returns {Promise<boolean>} - True if passwords match
 */
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
