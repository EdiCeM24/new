const express = require("express");
const { adminDashboard } = require("../controllers/admin.controller");

const adminRouter = express.Router();

adminRouter.get("/dashboard", adminDashboard);

module.exports = adminRouter;
