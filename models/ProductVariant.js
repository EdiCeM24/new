const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const ProductImage = require("../models/ProductImage");
const Product = require("./Product");

const productVariantSchema = sequelize.define(
  "ProductVariant",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
    },

    color: {
      type: DataTypes.STRING,
      hex: DataTypes.STRING,
    },
    size: {
      type: DataTypes.ENUM(
        "M",
        "L",
        "XL",
        "XXL",
        "30",
        "32",
        "40",
        "42",
        "44",
        "45",
      ),
    },
    brands: {
      type: DataTypes.STRING,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  { timestamps: true },
);

const ProductVariant = productVariantSchema;

ProductVariant.belongsTo(ProductImage, { foreignKey: "ProductImageId" });
ProductVariant.belongsTo(Product);
Product.hasMany(ProductVariant);

module.exports = ProductVariant;
