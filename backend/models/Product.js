// models/Product.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Order from './Order.js';
import ActivityLog from './ActivityLog.js';

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

// Add associations
Product.hasMany(Order, { foreignKey: 'productId' });
Order.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(ActivityLog, { foreignKey: 'productId' });
ActivityLog.belongsTo(Product, { foreignKey: 'productId' });

export default Product;
