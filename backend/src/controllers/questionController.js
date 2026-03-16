import db from '../config/db.js';

export const getQuestions = async (req, res) => {
    try {
        const { categoryId, levelId, unitIds } = req.query; 

        if (!categoryId || !unitIds) {
            return res.status(400).json({ message: "Missing Category or Unit" });
        }

        const unitArray = unitIds.split(',');

        const [rows] = await db.query(
            `SELECT q.*, c.CategoryName, u.UnitName 
             FROM question q
             JOIN category c ON q.CategoryID = c.CategoryID
             JOIN unit u ON q.UnitID = u.UnitID
             WHERE q.CategoryID = ? AND q.UnitID IN (?)`,
            [categoryId, unitArray]
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUnits = async (req, res) => {
    try {
        const { levelId, categoryId } = req.query;
        
        const [rows] = await db.query(
            'SELECT * FROM unit WHERE LevelID = ?',
            [levelId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};