const jwt = require("jsonwebtoken");
const { JWT_WEB_SECRET_KEY } = require("../config/env");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const redis = require("redis");

const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

//
const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (await isTokenRevoked(token)) {
    return res.status(401).json({ message: "Token revoked!" });
  }

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  try {
    const decoded = jwt.verify(token, JWT_WEB_SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
});

const isTokenRevoked = asyncHandler(async (token) => {
  const decoded = jwt.decode(token);
  const revoked = await redisClient.get(`revoked:${decoded.jti}`);
  return revoked === "revoked";
});

module.exports = verifyToken;
