// server.js or index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import sequelize from './config/database.js'; //
import apiRoutes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { requestLogger, errorLogger } from './middleware/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use("/api", apiRoutes);

// 404 handler for unmatched routes
app.use(notFound);

// Error logging (before error handler)
app.use(errorLogger);

// Global error handler (must be last)
app.use(errorHandler);

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
