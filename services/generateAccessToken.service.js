const crypto = require("crypto");
const { JWT_SECRET_KEY } = require("../config/env.js");
const jwt = require("jsonwebtoken");
const { secret } = require("../auth/config.js");

const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET_KEY,
    {
      expiresIn: secret.accessTokenExpiresIn,
    },
  );
  return accessToken;
};

module.exports = generateAccessToken;
