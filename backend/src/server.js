import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Main API Router
app.use('/api', routes);

// Global Error Handler Middleware (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});