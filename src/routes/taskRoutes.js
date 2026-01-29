const express = require('express');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new task
router.post('/', authMiddleware, createTask);

// Get all tasks for the logged-in user
router.get('/', authMiddleware, getTasks);

// Update a task (mark as completed/deleted/pending)
router.put('/:id', authMiddleware, updateTask);

// Delete a task
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;
