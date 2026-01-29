const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const methodOverride = require("method-override"); // Allow HTML forms to simulate PUT/DELETE
const session = require("express-session"); // Session middleware
const logger = require("./utils/logger");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
const app = express();

// -------------------- Middleware --------------------
app.use(express.json()); // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data from HTML forms
app.use(cors()); // Enable cross-origin requests
app.use(morgan("dev")); // Log HTTP requests in development format
app.use(logger); // Custom logger middleware
app.use(methodOverride("_method")); // Allow HTML forms to send PUT/DELETE requests

// -------------------- Session Configuration --------------------
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "supersecret", // Key used to sign the session ID cookie
  resave: false, // Prevents resaving unchanged sessions
  saveUninitialized: false, // Prevents saving empty sessions
  cookie: {
    maxAge: 1000 * 60 * 60, // Session cookie lifespan: 1 hour
  },
};

// Only use MongoStore in production, not in development/tests
if (process.env.NODE_ENV === "production") {
  try {
    const MongoStore = require("connect-mongo");
    sessionConfig.store = new MongoStore({
      mongoUrl: process.env.MONGO_URI, // MongoDB connection string for storing sessions
      collectionName: "sessions", // Collection name where sessions are stored
    });
  } catch (err) {
    console.warn("MongoStore not available, using memory store:", err.message);
  }
}

app.use(session(sessionConfig));

// -------------------- API Routes --------------------
app.use("/api/auth", authRoutes); // Routes for user registration and login
app.use("/api/tasks", taskRoutes); // Routes for task CRUD operations

// -------------------- View Engine Setup --------------------
app.set("view engine", "ejs"); // Use EJS as the template engine
app.set("views", __dirname + "/views"); // Directory containing EJS templates

// -------------------- View Routes --------------------
const viewRoutes = require("./routes/viewRoutes");
app.use("/", viewRoutes); // Routes that render EJS templates (register, login, tasks UI)

// -------------------- Error Handler --------------------
app.use(errorHandler); // Centralized error handling middleware

// -------------------- MongoDB Connection --------------------
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI) // Connect to MongoDB using URI from environment variables
    .then(() => console.log("MongoDB connected")) // Log success message
    .catch((err) => console.error(err)); // Log error if connection fails
}

module.exports = app;
