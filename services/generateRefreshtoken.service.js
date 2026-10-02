const crypto = require("crypto");

// RefreshToken Generate function
const generateRefreshToken = () => {
  const refreshedToken = crypto.randomBytes(64).toString("hex");

  return refreshedToken;
};

module.exports = generateRefreshToken;
