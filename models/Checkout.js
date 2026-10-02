const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const Order = require("./Order");

const checkoutSchema = sequelize.define(
  "Checkout",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    paymentMethod: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    checkoutDate: {
      type: DataTypes.DATE,
    },
  },
  { timestamps: true },
);

const Checkout = checkoutSchema;

Checkout.belongsTo(Order);
Order.hasOne(Checkout);

module.exports = Checkout;
