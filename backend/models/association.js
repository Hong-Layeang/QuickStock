// backend/models/association.js
import Product from './Product.js';
import User from './User.js';
import Report from './Report.js';
import ActivityLog from './ActivityLog.js';

// Product associations
Product.belongsTo(User, { foreignKey: 'supplierId', as: 'supplier' });
Product.hasMany(Report, { foreignKey: 'productId' });
Product.hasMany(ActivityLog, { foreignKey: 'productId' });

// Report associations
Report.belongsTo(Product, { foreignKey: 'productId' });
Report.belongsTo(User, { foreignKey: 'userId' });

// ActivityLog associations
ActivityLog.belongsTo(Product, { foreignKey: 'productId' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

// User associations
User.hasMany(Report, { foreignKey: 'userId' });
User.hasMany(ActivityLog, { foreignKey: 'userId' });