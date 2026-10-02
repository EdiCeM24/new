const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const User = require("../models/User");
const Product = require("./Product");
const ProductVariant = require("./ProductVariant");

const cartSchema = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
  },
  { timestamps: true },
);

const Cart = cartSchema;

Cart.belongsTo(User);
User.hasMany(Cart);

Cart.belongsToMany(Product, { through: "productId" });

Cart.belongsToMany(ProductVariant, { through: "CartItems" });

module.exports = Cart;
