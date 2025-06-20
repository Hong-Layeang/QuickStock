import express from 'express';
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

// MongoDb connection
connectDB();

const app = express();
const PORT = process.env.PORT || 3001; // set a default PORT for backup

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/login", authRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    console.log("Server is running at http://localhost:" + PORT);
})