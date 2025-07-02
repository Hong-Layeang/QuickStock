import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = new Sequelize(process.env.DB_URL, {
  dialect: 'mysql',
  logging: false,
});

export default connectDB;
