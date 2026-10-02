const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const contactSchema = sequelize.define(
  "Contact",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      required: true,
      trim: true,
      allowNull: false,
      validate: {
        isEmail: true,
        isLowercase: true,
      },
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lockUntil: {
      type: DataTypes.DATE,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resendCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    resendBlockedUntil: {
      type: DataTypes.DATE,
    },

    // userId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   references: {
    //     model: "User",
    //     key: "id",
    //   },
    //   onDelete: "CASCADE",
    //   onUpdate: "CASCADE",
    // },
    role: {
      type: DataTypes.ENUM("user", "admin", "super_admin"),
      defaultValue: "user",
    },
    isAdmin: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.role === "admin";
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { timestamp: true },
);

const Contact = contactSchema;

module.exports = Contact;
