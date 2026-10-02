const { Op } = require("sequelize");
const cleanupExpiredUsers = require("../jobs/cleanupExpiredUsers");
const hashToken = require("../utils/hashToken");
const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/User");

//Email Verification
const verifyEmail = asyncWrapper(async (req, res) => {
  const { token } = req.params.token;

  const hashedToken = await hashToken(token);

  // 2. Set the expiration to 30 minutes in the past/future depending on your logic
  const user = await User.findOne({
    where: {
      verificationToken: hashedToken,
      verificationTokenExpires: {
        [Op.gt]: new Date(Date.now() > 30 * 60 * 60 * 1000),
      },
    },
  });

  if (!user) {
    req.flash("error_msg", "Invalid or expired token");
    await cleanupExpiredUsers();
    return res.redirect("/auth/sign-up");
  }

  user.isVerified = true;

  user.verificationToken = null;
  user.verificationTokenExpires = null;

  await user.save();

  req.flash("success_msg", "Email verified successfully ✅");

  return res.redirect("/auth/verify-success");
});

module.exports = { verifyEmail };
