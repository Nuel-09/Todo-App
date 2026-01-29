// src/tests/task.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // src/app.js
const User = require("../models/User");
const Task = require("../models/Task");

let token;

beforeAll(async () => {
  // Connect to MongoDB once before all tests
  await mongoose.connect(process.env.MONGO_URI);

  // Clear collections before starting
  await User.deleteMany({});
  await Task.deleteMany({});

  // Register and login to get token
  await request(app)
    .post("/api/auth/register")
    .send({ username: "taskuser", password: "taskpassword" });

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ username: "taskuser", password: "taskpassword" });

  token = loginRes.body.token;
});

afterAll(async () => {
  // Close MongoDB connection after all tests finish
  await mongoose.connection.close();
});

describe("Task API Integration Tests", () => {
  it("should create a new task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Finish assignment", status: "pending" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "Finish assignment");
  });

  it("should get tasks for the user", async () => {
    // Create a task first
    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Temp task", status: "pending" });

    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update a task", async () => {
    // Create a task first
    const createRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Update me", status: "pending" });

    const taskId = createRes.body._id;

    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "completed" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "completed");
  });

  it("should delete a task", async () => {
    // Create a task first
    const createRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Delete me", status: "pending" });

    const taskId = createRes.body._id;

    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Task deleted");
  });
});
