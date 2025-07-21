// Modify everything on database here 👇

import sequelize from '../config/database.js';

async function modifyDatabase() {
  try {
    await sequelize.query('ALTER TABLE Reports DROP COLUMN customerName;');
    console.log('Success!.');
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

modifyDatabase();