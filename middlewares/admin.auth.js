const { asyncHandler } = require("../utils/asyncHandler");

const isSuperAdmin = asyncHandler(async (req, res, next) => {
  if (req.session.user.role !== "super_admin") {
    req.flash("error_msg", "Access Denied!");

    return res.redirect("/api/v1/auth/login");
  }

  next();
});

module.exports = isSuperAdmin;
