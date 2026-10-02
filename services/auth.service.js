const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const cookieOptions = require("../config/cookies");
const { JWT_WEB_SECRET_KEY } = require("../config/env");
const { hashToken } = require("../utils/hashToken");
//

const verifyRefreshToken = asyncHandler(async (req, res) => {
  try {
    const refreshToken = await RefreshToken.findOne({
      where: { token: req.body.token },
    });

    if (!refreshToken) {
      req.flash("error_msg", "Invalid token");
      return res.redirect("/auth/login");
    }

    const { userId, expiresAt } = refreshToken;
    if (new Date(Date.now()) > expiresAt) {
      await refreshToken.destroy();
      req.flash("error_msg", "Refresh token has expired.");
      return res.redirect("/auth/login");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      req.flash("error_msg", "User not found.");
      return res.redirect("/auth/login");
    }

    const accessToken = jwt.sign({ userId }, JWT_WEB_SECRET_KEY, {
      expiresIn: new Date(Date.now() + 20 * 60 * 60 * 1000),
    });

    // hashed Token before save
    const hashedRefreshToken = hashToken(refreshToken);

    await RefreshToken.create({
      refreshToken: hashedRefreshToken,
      expiresAt,
      userId,
    });

    res.cookie("accessToken", accessToken, cookieOptions);

    res.cookie("refreshToken", refreshToken, cookieOptions);

    req.flash("success_msg", "Token was verified!");
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Invalid token and server error");
    return res.redirect("/auth/login");
  }
});

module.exports = verifyRefreshToken;
