import express from 'express';
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js';

import userRoutes from './routes/UserRoutes.js';
import useAuthStore from '../frontend/src/store/useAuthStore.js';

dotenv.config();

// MongoDb connection
connectDB();

const app = express();
const PORT = process.env.PORT || 3001; // set a default PORT for backup

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/", useAuthStore);

app.listen(PORT, () => {
    console.log("Server is running at http://localhost:" + PORT);
})