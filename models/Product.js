const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
// const Category = require("./Category");
const ProductImage = require("./ProductImage");

const productSchema = sequelize.define(
  "Product",
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
    image: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    stock: {
      type: DataTypes.INTEGER,
    },
    desc: {
      type: DataTypes.TEXT,
    },
    slug: {
      type: DataTypes.STRING,
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: "Category",
        key: "id",
      },
    },
  },
  { timestamps: true },
);

const Product = productSchema;

Product.hasMany(ProductImage, { foreignKey: "categoryId" });

module.exports = Product;
