const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const { JWT_WEB_SECRET_KEY } = require("../config/env");

//
const protects = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.flash("error_msg", "Unauthorize access");
    return res.redirect("/auth/login");
  }

  const decoded = jwt.verify(token, JWT_WEB_SECRET_KEY);
  const user = await User.findByPk(decoded.id);

  if (!user) {
    req.flash("error_msg", "You are not authorized!");
    return res.redirect("/auth/login");
  }

  req.user = decoded.id;

  next();
});

// Restriction
const authorize = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    // Role is undefined
    const user = await User.findByPk(req.user.id);

    if (!user) {
      req.flash("error_msg", "User not found!");
      return res.redirect("/auth/login");
    }

    if (!roles.includes(req.user.role)) {
      req.flash("error_msg", "Forbidden. Access denied.");
      return res.redirect("/auth/login");
    }

    next();
  });
};

module.exports = { protects, authorize };
