const { DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");

const LoginDevice = sequelize.define("LoginDevice", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  deviceId: {
    type: DataTypes.STRING,
  },
  browser: {
    type: DataTypes.STRING,
  },
  os: {
    type: DataTypes.STRING,
  },
  ipAddress: {
    type: DataTypes.STRING,
  },
  refreshToken: {
    type: DataTypes.TEXT,
  },
  indexes: {
    unique: true,
    field: ["userId", "deviceId"],
  },
});

module.exports = LoginDevice;
