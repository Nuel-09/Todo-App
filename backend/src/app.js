/**
 * Todo App Main Application File
 * Sets up Express server, middleware, routes, and database connection
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv"); // ✅ require first
const methodOverride = require("method-override");
const session = require("express-session");
const logger = require("./utils/logger");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

// ✅ Load environment variables from .env file
dotenv.config();

const app = express();

// ==================== MIDDLEWARE ====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(logger);
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/../public"));

// ==================== SESSION CONFIGURATION ====================

const sessionConfig = {
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
  },
};

if (process.env.NODE_ENV === "production") {
  try {
    const MongoStore = require("connect-mongo");
    sessionConfig.store = new MongoStore({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    });
  } catch (err) {
    console.warn("MongoStore not available, using memory store:", err.message);
  }
}

app.use(session(sessionConfig));

// ==================== API ROUTES ====================

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ==================== ROOT ROUTE ====================

app.get("/", (req, res) => {
  res.send("Welcome to the Todo App! The API is live 🚀");
});

// ==================== ERROR HANDLING ====================

app.use(errorHandler);

// ==================== DATABASE CONNECTION ====================

if (process.env.NODE_ENV !== "test") {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI is not defined in .env");
    process.exit(1);
  }

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

module.exports = app;
