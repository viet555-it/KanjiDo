import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API chạy thử để kiểm tra kết nối DB
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM levels');
        res.json({ message: "Kết nối DB thành công!", data: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});