import db from '../config/db.js';

export const getGroup = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM character_groups');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ massage: error.message });
    }
};

export const getCharactersByGroup = async (req, res) => {
    try {
        const { groupIds} = req.query;
        if (!groupIds) {
            return res.status(400).json({ message: 'Please provide groupIds' })
        }

        const ids = groupIds.split(',');
        const [rows] = await db.query(
            'SELECT * FROM characters WHERE group_id IN (?)',
            [ids]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};