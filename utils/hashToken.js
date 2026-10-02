const crypto = require("crypto");

const hashToken = (hashedToken) => {
  return crypto.createHash("sha256").update(hashedToken).digest("hex");
};

module.exports = hashToken;
