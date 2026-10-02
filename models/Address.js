const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const User = require("./User");

const addressSchema = sequelize.define("Address", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  phone: {
    type: DataTypes.STRING,
  },
  street: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
});

const Address = addressSchema;

Address.belongsTo(User);
User.hasMany(Address);

module.exports = Address;
