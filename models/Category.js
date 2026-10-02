const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
// const Product = require("./Product");

const categorySchema = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: true,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { tableName: "Category", timestamps: true },
);

const Category = categorySchema;

// Category.hasMany(Product, { foreignKey: "categoryId" });

module.exports = Category;
