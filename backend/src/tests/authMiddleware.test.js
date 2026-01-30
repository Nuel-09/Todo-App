// src/tests/authMiddleware.test.js
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

// Set JWT_SECRET for testing
process.env.JWT_SECRET = "test-secret-key";

describe("authMiddleware Unit Tests", () => {
  it("should attach user to request if token is valid", () => {
    const token = jwt.sign({ id: "123" }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(req.user).toEqual({ id: "123" });
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if no token provided", () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
  });
});
