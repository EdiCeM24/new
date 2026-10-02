const express = require("express");

const { register, logoutHandler } = require("../controllers/auth.controller");
const limiter = require("../middlewares/limitRate");
const validateInput = require("../middlewares/inputValidator");
const {
  signupHandler,
  loginHandler,
  verifyEmailToken,
  verifySuccess,
} = require("../controllers/home.controller");
const verifyToken = require("../middlewares/verifyToken");
const { protects, authorize } = require("../middlewares/protects");
const { user, signInHandler } = require("../controllers/authLogin.controller");
const { verifyEmail } = require("../controllers/verifyEmail.controller");

const authRouter = express.Router();

// GET METHODS
authRouter.get("/sign-up", signupHandler);
// verifyEmail,
authRouter.get("/login", protects, loginHandler);

authRouter.get("/verify-email", verifyEmailToken);

authRouter.get("/verify-success", verifySuccess);

authRouter.get(
  "/user",
  protects,
  authorize(["user", "super_admin", "admin"]),
  user,
);

// POST METHODS

authRouter.post("/verify-email/:token", verifyEmail);

authRouter.post("/sign-in", limiter, validateInput, signInHandler);

authRouter.post("/logout", limiter, verifyToken, logoutHandler);

authRouter.post("/register", limiter, validateInput, register);

module.exports = authRouter;
