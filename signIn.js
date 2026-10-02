const asyncWrapper = require("../middlewares/asyncWrapper");
const { Op } = require("sequelize");
const User = require("../models/User");
const bcryptSalt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
// const rawToken = crypto.randomBytes(32).toString("hex");
const cookieOptions = require("../config/cookies");
const redis = require("redis");

//LOGIN USER
const signInHandler = asyncWrapper(async (req, res) => {
  try {
    const { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      req.flash("error_msg", "All fields are required, please fill.");
      return res.redirect("/auth/login");
    }

    // Email Verification
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      req.flash("error_msg", "Invalid email pattern.");
      await user.destroy();

      return res.redirect("/auth/login");
    }

    // Strong password validation
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!%*?&])/;

    if (strongPassword.test(password)) {
      req.flash(
        "error_msg",
        "Password must contain uppercase, lowercase, number and special character",
      );
      await user.destroy();

      return res.redirect("/auth/login");
    }

    const user = await User.findOne({
      where: { [Op.or]: [{ email }, { password }] },
    });

    if (!user) {
      req.flash("error_msg", "User is not recognized!");
      await user.destroy();
      return res.redirect("/auth/sign-up");
    }

    // ACCOUNT LOCK CHECK
    if (user.lockUntil && user.lockUntil > new Date()) {
      req.flash("error_msg", "Account locked. Try again later.");
      await user.destroy();
      return res.redirect("/auth/sign-up");
    }

    const validPassword = await bcryptSalt.compare(password, user.password);

    if (!validPassword) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 1 * 60 * 60 * 1000);

        user.failedLoginAttempts = 0;
      }

      await user.save();

      req.flash("error_msg", "Invalid email or password.");

      await user.destroy();
      return res.redirect("/auth/sign-up");
    }

    // REQUIRE VERIFIED EMAIL
    if (!user.isVerified) {
      req.flash("error_msg", "Please verify your account first");

      await user.destroy();

      return res.redirect("/auth/sign-up");
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    await user.save();

    // ACCESS TOKEN
    const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT, {
      expiresIn: new Date(Date.now() + 15 * 60 * 1000),
    });

    const refreshToken = jwt.sign({ id: user.id }, "", {
      expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await RefreshToken.create({
      refreshToken: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    res.cookie("accessToken", accessToken, {
      secure: NODE_ENV === "production",
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      secure: NODE_ENV === "production",
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    req.flash("success_msg", "You are logged in successfully! ✅");
    return res.redirect("/api/");
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Error logging you in");
    return res.redirect("/auth/sign-up");
  }
});
