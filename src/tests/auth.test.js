// src/tests/auth.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // src/app.js
const User = require("../models/User");

beforeAll(async () => {
  // Connect to MongoDB before running tests
  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  // Clear users collection before each test
  await User.deleteMany({});
});

afterAll(async () => {
  // Close DB connection after all tests finish
  await mongoose.connection.close();
});

describe("Auth API Integration Tests", () => {
  let registeredUserId;

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser", password: "testpassword" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");

    // Verify user was actually created in DB
    const user = await User.findOne({ username: "testuser" });
    expect(user).toBeDefined();
    registeredUserId = user._id;
  });

  it("should login an existing user", async () => {
    // First register the user
    await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser", password: "testpassword" });

    // Then login
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "testpassword" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
