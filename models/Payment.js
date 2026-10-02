const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const paymentSchema = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // userId: {
    //   type: DataTypes.UUID,
    //   references: {
    //     model: "User",
    //     key: "id",
    //   },
    //   onDelete: "CASCADE",
    //   onUpdate: "CASCADE",
    // },
    paymentMethod: {
      type: DataTypes.STRING,
    },
    paymentStatus: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true },
);

const Payment = paymentSchema;

module.exports = Payment;
