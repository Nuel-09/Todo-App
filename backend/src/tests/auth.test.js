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
  const testUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "testpassword"
  };

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Registration successful");

    // Verify user was actually created in DB
    const user = await User.findOne({ username: testUser.username });
    expect(user).toBeDefined();
    registeredUserId = user._id;
  });

  it("should login an existing user with username", async () => {
    // First register the user
    await request(app)
      .post("/api/auth/register")
      .send(testUser);

    // Then login using username
    const res = await request(app)
      .post("/api/auth/login")
      .send({ usernameOrEmail: testUser.username, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("userId");
  });

  it("should login an existing user with email", async () => {
    // First register the user
    await request(app)
      .post("/api/auth/register")
      .send(testUser);

    // Then login using email
    const res = await request(app)
      .post("/api/auth/login")
      .send({ usernameOrEmail: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("userId");
  });
});
