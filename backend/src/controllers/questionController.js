import db from '../config/db.js';

/**
 * Get questions for a specific Quiz
 * Based on ERD: Quiz -> Quiz_Items -> (Vocabulary OR Kanji OR Kana)
 */
export const getQuestions = async (req, res) => {
    try {
        const { quizId } = req.params; 

        if (!quizId) {
            return res.status(400).json({ message: "Quiz ID is required" });
        }

        // 1. Get sample item to determine type
        const [items] = await db.query(
            `SELECT qi.* FROM Quiz_Items qi WHERE qi.QuizID = ? LIMIT 1`,
            [quizId]
        );

        if (items.length === 0) {
            return res.status(404).json({ message: "No items found for this quiz" });
        }

        let query = '';
        let type = '';

        if (items[0].VocabID) {
            type = 'Vocabulary';
            query = `
                SELECT qi.ItemID, v.VocabID, v.Word, v.Furigana, v.Meaning
                FROM Quiz_Items qi
                JOIN Vocabulary v ON qi.VocabID = v.VocabID
                WHERE qi.QuizID = ?`;
        } else if (items[0].KanjiID) {
            type = 'Kanji';
            query = `
                SELECT qi.ItemID, k.KanjiID, k.Character, k.Onyomi, k.Kunyomi, k.Meaning
                FROM Quiz_Items qi
                JOIN Kanji k ON qi.KanjiID = k.KanjiID
                WHERE qi.QuizID = ?`;
        } else if (items[0].KanaID) {
            type = 'Kana';
            query = `
                SELECT qi.ItemID, kn.KanaID, kn.Character, kn.Romaji
                FROM Quiz_Items qi
                JOIN Kana kn ON qi.KanaID = kn.KanaID
                WHERE qi.QuizID = ?`;
        }

        const [questions] = await db.query(query, [quizId]);
        const [quizHeader] = await db.query(`SELECT * FROM Quiz WHERE QuizID = ?`, [quizId]);

        res.json({
            quizTitle: quizHeader[0]?.QuizTitle,
            difficulty: quizHeader[0]?.Difficulty,
            type: type,
            questions: questions
        });

    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get available quizzes - filtered by LessonId
 * Uses 'Lession' to match the ERD table name.
 */
export const getQuizzes = async (req, res) => {
    try {
        const { lessonId } = req.query;

        let query = `SELECT DISTINCT q.* FROM Quiz q`;
        let params = [];

        if (lessonId) {
            // Join Quiz items back to the Lesson table (Lession)
            query = `
                SELECT DISTINCT q.* 
                FROM Quiz q 
                JOIN Quiz_Items qi ON q.QuizID = qi.QuizID
                LEFT JOIN Vocabulary v ON qi.VocabID = v.VocabID
                LEFT JOIN Kanji k ON qi.KanjiID = k.KanjiID
                LEFT JOIN Kana kn ON qi.KanaID = kn.KanaID
                WHERE v.LessonID = ? OR k.LessonID = ? OR kn.LessonID = ?`;
            params = [lessonId, lessonId, lessonId];
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error("Error in getQuizzes:", error);
        res.status(500).json({ message: error.message });
    }
};