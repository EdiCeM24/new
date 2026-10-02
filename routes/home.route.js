const express = require("express");
const { homePage } = require("../controllers/home.controller");
const { adminDashboard } = require("../controllers/admin.controller");
const { protects, authorize } = require("../middlewares/protects");

const homeRouter = express.Router();

// protects
homeRouter.get("/home", homePage);

homeRouter.get(
  "/admin",
  protects,
  authorize(["super_admin", "admin"]),
  adminDashboard,
);

module.exports = homeRouter;
