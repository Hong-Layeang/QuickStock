// models/Product.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unitprice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM("in stock", "low stock", "out of stock", "discontinued"),
    defaultValue: "in stock",
  },
}, {
  timestamps: true,
});

Product.belongsTo(User, { foreignKey: "supplierId", as: "supplier" });

export default Product;
