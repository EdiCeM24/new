const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many requests, please try again later",
  },
});

module.exports = limiter;
