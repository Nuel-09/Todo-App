/**
 * Task Routes
 * All task endpoints require authentication via authMiddleware
 */

const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/tasks
 * Create a new task
 * Requires: Valid JWT token in Authorization header
 * Body: { title: string }
 */
router.post("/", authMiddleware, createTask);

/**
 * GET /api/tasks
 * Get all tasks for the logged-in user
 * Requires: Valid JWT token in Authorization header
 */
router.get("/", authMiddleware, getTasks);

/**
 * PUT /api/tasks/:id
 * Update a task's status (mark as completed/deleted/pending)
 * Requires: Valid JWT token in Authorization header
 * Body: { status: "pending" | "completed" | "deleted" }
 */
router.put("/:id", authMiddleware, updateTask);

/**
 * DELETE /api/tasks/:id
 * Delete a task permanently
 * Requires: Valid JWT token in Authorization header
 */
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
