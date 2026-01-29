const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// Set test environment
process.env.NODE_ENV = "test";

// Jest default timeout (all tests inherit this unless overridden)
jest.setTimeout(30000);

// Cleanup after all tests
afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
});
