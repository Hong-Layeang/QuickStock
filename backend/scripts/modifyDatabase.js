// Modify everything on database here 👇

import sequelize from '../config/database.js';

async function modifyDatabase() {
  try {
    // Drop tables if they exist (order matters due to FKs)
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.query('DROP TABLE IF EXISTS ActivityLogs');
    await sequelize.query('DROP TABLE IF EXISTS Reports');
    await sequelize.query('DROP TABLE IF EXISTS Products');
    await sequelize.query('DROP TABLE IF EXISTS Users');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Dropped tables: ActivityLogs, Reports, Products, Users');
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

modifyDatabase();