const asyncHandler = require("../utils/asyncHandler");

//
const checkResendLimit = asyncHandler(async (user) => {
  if (user.resendBlockedUntil && user.resendBlockedUntil > new Date()) {
    throw new Error("Too manay resend requests.");
  }

  user.resendCount += 1;

  if (user.resendCount >= 4) {
    user.resendBlockedUntil = new Date(Date.now() + 30 * 60 * 60 * 1000);
    user.resendCount = 0;
  }

  await user.save();
});

module.exports = checkResendLimit;
