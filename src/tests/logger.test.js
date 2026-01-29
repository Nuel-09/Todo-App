// src/tests/logger.test.js
const logger = require("../utils/logger");

describe("logger Unit Tests", () => {
  it("should call next()", () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    logger(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
