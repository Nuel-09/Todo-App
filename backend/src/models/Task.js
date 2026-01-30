/**
 * Task Model
 * Defines the Task schema with title, status, and user reference
 */

const mongoose = require("mongoose");

// Define Task schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "deleted"], // Only allow these values
      default: "pending", // New tasks start as pending
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model for ownership
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);

module.exports = mongoose.model("Task", taskSchema);
