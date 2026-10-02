const jwt = require("jsonwebtoken");
const {
  JWT_WEB_SECRET_KEY,
  JWT_WEB_REFRESH_SECRET_KEY,
} = require("../config/env");

//
export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, JWT_WEB_SECRET_KEY, {
    expiresIn: new Date(Date.now() + 20 * 60 * 60 * 1000),
  });
};

//
export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, JWT_WEB_REFRESH_SECRET_KEY, {
    expiresIn: new Date(Date.now() > 7 * 24 * 60 * 60 * 1000),
  });
};
