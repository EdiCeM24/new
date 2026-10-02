const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
// const Product = require("./Product");
// const ProductVariant = require("../models/ProductVariant");

const ProductImageSchema = sequelize.define(
  "ProductImage",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    imageUrl: {
      type: DataTypes.STRING,
    },

    imageType: {
      type: DataTypes.ENUM("back", "left", "right", "gallery"),
    },
  },
  { timestamps: true },
);

const ProductImage = ProductImageSchema;

module.exports = ProductImage;
