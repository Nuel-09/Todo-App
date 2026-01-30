/**
 * Task Controller
 * Handles CRUD operations for tasks (Create, Read, Update, Delete)
 */

const Task = require("../models/Task");

/**
 * Create a new task
 * POST /api/tasks
 * Body: { title: string }
 * Requires: Authentication (via authMiddleware)
 */
exports.createTask = async (req, res) => {
  try {
    const { title } = req.body;

    // Create task associated with authenticated user
    const task = new Task({ title, user: req.user.id });
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Task creation failed", details: err.message });
  }
};

/**
 * Get all tasks for the authenticated user
 * GET /api/tasks
 * Requires: Authentication (via authMiddleware)
 * Returns: Array of task objects
 */
exports.getTasks = async (req, res) => {
  try {
    // Fetch only tasks belonging to the authenticated user
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Fetching tasks failed", details: err.message });
  }
};

/**
 * Update a task's status
 * PUT /api/tasks/:id
 * Body: { status: "pending" | "completed" | "deleted" }
 * Requires: Authentication (via authMiddleware)
 */
exports.updateTask = async (req, res) => {
  try {
    const { status } = req.body;

    // Update only if task belongs to authenticated user
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true }, // Return updated document
    );

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: "Update failed", details: err.message });
  }
};

/**
 * Delete a task
 * DELETE /api/tasks/:id
 * Requires: Authentication (via authMiddleware)
 */
exports.deleteTask = async (req, res) => {
  try {
    // Delete only if task belongs to authenticated user
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: "Delete failed", details: err.message });
  }
};
