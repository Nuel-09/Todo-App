const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// -------------------- Dashboard Page --------------------
router.get("/dashboard", async (req, res) => {
  try {
    // Render dashboard if user is logged in
    if (!req.session.userId) {
      // If not logged in, show public dashboard
      return res.render("dashboard", { user: null, pendingTasks: [], completedTasks: [] });
    }

    // Get user data
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.render("dashboard", { user: null, pendingTasks: [], completedTasks: [] });
    }

    // Fetch tasks for this user (if tasks are user-specific)
    // For now, return all tasks
    const tasks = await Task.find().catch(() => []);
    const pendingTasks = tasks.filter(t => t.status === "pending");
    const completedTasks = tasks.filter(t => t.status === "completed");

    res.render("dashboard", { user, pendingTasks, completedTasks });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.render("dashboard", { user: null, pendingTasks: [], completedTasks: [] });
  }
});

// -------------------- Register Page --------------------
router.get("/register", (req, res) => {
  // Render the registration form (register.ejs)
  res.render("register", { error: null });
});

// -------------------- Register Form Submission --------------------
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Register attempt:", {
      username,
      password_length: password?.length,
    });

    // Validate inputs
    if (!username || !password) {
      console.log("Missing username or password");
      return res
        .status(400)
        .render("register", { error: "Username and password required" });
    }

    // Create new user
    const user = new User({ username, password });
    console.log("User object created:", user);

    await user.save();
    console.log("User saved successfully");

    // Redirect to login on success
    res.redirect("/login?success=registered");
  } catch (err) {
    console.error("Register error details:", err.message, err.stack);
    res
      .status(400)
      .render("register", { error: "Registration failed: " + err.message });
  }
});

// -------------------- Login Page --------------------
router.get("/login", (req, res) => {
  // Render the login form (login.ejs)
  const success = req.query.success;
  res.render("login", { error: null, success });
});

// -------------------- Login Form Submission --------------------
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate inputs
    if (!username || !password) {
      return res
        .status(400)
        .render("login", { error: "Username and password required" });
    }

    // Find user and verify password
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).render("login", { error: "Invalid credentials" });
    }

    // Generate JWT token and store in session
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    req.session.token = token;
    req.session.userId = user._id;

    // Redirect to tasks page on success
    res.redirect("/tasks");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).render("login", { error: "Login failed: " + err.message });
  }
});

// -------------------- Tasks Page --------------------
router.get("/tasks", async (req, res) => {
  try {
    // Fetch all tasks (no login required)
    const tasks = await Task.find().catch((err) => {
      console.log("Task.find error:", err);
      return [];
    });
    // Render the task.ejs view and pass tasks data
    res.render("task", { tasks: tasks || [] });
  } catch (err) {
    console.error("Error loading tasks:", err);
    res.render("task", { tasks: [] });
  }
});

// -------------------- Create Task --------------------
router.post("/tasks", async (req, res) => {
  try {
    // Create a new task (no login required)
    const { title } = req.body;

    // Validate title is provided
    if (!title || title.trim() === "") {
      console.log("No title provided. req.body:", req.body);
      return res.status(400).send("Task title is required");
    }

    const task = new Task({ title: title.trim() });
    await task.save();
    // Redirect back to tasks page to show updated list
    res.redirect("/tasks");
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).send("Error creating task: " + err.message);
  }
});

// -------------------- Update Task --------------------
router.put("/tasks/:id", async (req, res) => {
  try {
    // Update task status (pending → completed, etc.)
    const { status } = req.body;
    await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    // Redirect back to tasks page to show updated list
    res.redirect("/tasks");
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).send("Error updating task: " + err.message);
  }
});

// -------------------- Delete Task --------------------
router.delete("/tasks/:id", async (req, res) => {
  try {
    // Delete a task (no login required)
    await Task.findByIdAndDelete(req.params.id);
    // Redirect back to tasks page to show updated list
    res.redirect("/tasks");
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Error deleting task: " + err.message);
  }
});

// -------------------- Logout --------------------
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
