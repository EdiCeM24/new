const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const Order = require("./Order");
const ProductVariant = require("./ProductVariant");

const orderItemSchema = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    pricAtPurchase: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  { timestamps: true },
);

const OrderItem = orderItemSchema;

OrderItem.belongsTo(Order);
Order.hasMany(OrderItem);

OrderItem.belongsTo(ProductVariant);
ProductVariant.hasMany(OrderItem);

module.exports = OrderItem;
