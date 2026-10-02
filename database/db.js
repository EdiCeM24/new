const { Sequelize } = require("sequelize");
const {
  DB_NAME,
  DB_PASS,
  DB_USER,
  DB_PORT,
  // NODE_ENV,
} = require("../config/env");

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: "localhost",
  dialect: "postgres",
  port: DB_PORT,
  logging: console.log,
  // NODE_ENV === "production" ? false : console.log("development.local"),
});

module.exports = sequelize;
