// server.js or index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import sequelize from './config/database.js'; //
import userRoutes from './routes/UserRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/login", authRoutes);
app.use("/api/products", productRoutes);

// DB connection + table syncing
sequelize.authenticate()
  .then(() => {
    console.log("✅ Connected to MySQL via Railway!");

    // Auto-create tables if they don’t exist
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log("✅ Tables synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });
