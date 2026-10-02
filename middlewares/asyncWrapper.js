const asyncHandler = require("express-async-handler");

const asyncWrapper = (fn) => {
  return asyncHandler(async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  });
};

module.exports = asyncWrapper;
