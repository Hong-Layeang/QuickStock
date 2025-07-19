// models/User.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Order from './Order.js';
import ActivityLog from './ActivityLog.js';

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "supplier"),
    defaultValue: "supplier",
  },
}, {
  timestamps: true,
});

// Add associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ActivityLog, { foreignKey: 'userId' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

export default User;
