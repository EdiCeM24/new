const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

//
const refreshTokenSchema = sequelize.define(
  "RefreshToken",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { timestamps: true },
);

const RefreshToken = refreshTokenSchema;

module.exports = RefreshToken;
