const asyncWrapper = require("../middlewares/asyncWrapper");
const { Op } = require("sequelize");
const User = require("../models/User");
const bcryptSalt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { CLIENT_URL } = require("../config/env");
const RefreshToken = require("../models/RefreshToken");
// const rawToken = crypto.randomBytes(32).toString("hex");
const cookieOptions = require("../config/cookies");
// const redis = require("redis");
const sendEmail = require("../config/sendEmail");
const sequelize = require("../database/db");

// Redis Implementation
// const redisClient = redis.createClient({
//   host: "localhost",
//   port: 6379,
// });

const register = asyncWrapper(async (req, res) => {
  const { name, username, email, password } = req.body;

  const profile = req.file.buffer;

  name = name?.trim();
  username = username?.trim();
  email = email?.trim().toLowerCase();
  password = password?.trim();
  profile = profile?.trim();

  if (!name || !username || !email || !password || !profile) {
    req.flash("error_msg", "All fields are reguired!");

    return res.redirect("/auth/sign-up");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    req.flash("error_msg", "Invalid email pattern.");

    return res.redirect("/auth/sign-up");
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;

  if (!usernameRegex.test(username)) {
    req.flash(
      "error_msg",
      "Invalid username pattern, it should have a special character.",
    );

    return res.redirect("/auth/sign-up");
  }

  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

  if (!strongPassword.test(password)) {
    req.flash(
      "error_msg",
      "Password must contain uppercase, lowercase, number and special character",
    );

    return res.redirect("/auth/sign-up");
  }

  if (password.length < 8) {
    req.flash("error_msg", "Password must be at least 8 characters");
    return res.redirect("/auth/sign-up");
  }

  const transaction = await sequelize.transaction();
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
      transaction,
    });

    if (user) {
      await transaction.rollback();

      req.flash("error_msg", "User already exist");

      return res.redirect("/auth/sign-up");
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = hashToken(rawToken);

    const verificationTokenExpires = new Date(Date.now() + 30 * 60 * 60 * 1000);

    const salt = await bcryptSalt.genSalt(12);
    const hashedPassword = await bcryptSalt.hash(password, salt);

    const newUser = await User.create(
      {
        name,
        username,
        email,
        password: hashedPassword,
        profile,
        verificationToken: hashedToken,
        verificationTokenExpires: verificationTokenExpires,
      },
      { transaction },
    );

    const verifyLink = `${CLIENT_URL}/auth/verify-email${rawToken}`;

    // await send
    await sendEmail({
      html: `
          <h2 class="">Email Verification</h2>
          
          <strong>This link expires in 20 minutes.</strong>

          <a href="${verifyLink}">Verify Account</a>
        `,
    });

    await transaction.commit();

    req.flash("success_msg", "Registration successful. check your email. ✅");
    return res.redirect("/auth/verify-email");
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Error registering you: ", error);

    return res.redirect("auth/sign-up");
  }
});

// LOGOUT USER
const logoutHandler = asyncWrapper(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  await redisClient.set(
    `revoked:${jwt.decode(token).jti}`,
    "revoked",
    "EX",
    3600,
  );

  if (refreshToken) {
    await RefreshToken.destroy({
      where: {
        token: hashToken(refreshToken),
      },
    });
  }

  res.clearCookie("accessToken", cookieOptions.accessToken);
  res.clearCookie("refreshToken", cookieOptions.refreshToken);

  req.flash("success_msg", "You have been logged out successfully.");

  return res.redirect("/api/v1/auth/login");
});

module.exports = { register, logoutHandler };
