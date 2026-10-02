const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const User = require("./User");
const Address = require("./Address");

const orderSchema = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
  },
  { timestamps: true },
);

const Order = orderSchema;

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsTo(Address);
Address.hasMany(Order);

module.exports = Order;
