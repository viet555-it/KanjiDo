import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình kết nối Database sử dụng biến môi trường từ .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'japanese_learning_db'
};

// Hàm chia nhỏ mảng thành các phần bằng nhau (mỗi phần 20 items)
const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

async function migrateData() {
    const connection = await mysql.createConnection(dbConfig);
    console.log("🚀 Bắt đầu quá trình Migration...");

    try {
        // --- 1. MIGRATION VOCABULARY ---
        const levels = ['n5', 'n4', 'n3', 'n2', 'n1'];
        for (const lvl of levels) {
            const vocabPath = path.join(__dirname, `../../data/vocabulary/${lvl}.json`);
            if (fs.existsSync(vocabPath)) {
                const data = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
                const chunks = chunkArray(data, 20); // Chia 20 từ mỗi bài

                for (let i = 0; i < chunks.length; i++) {
                    // Tạo bài học mới cho mỗi nhóm 20 từ
                    const [res] = await connection.execute(
                        "INSERT INTO `Lesson` (JLPT_Level, Title, Type) VALUES (?, ?, ?)",
                        [lvl.toUpperCase(), `Vocabulary ${lvl.toUpperCase()} - Lesson ${i + 1}`, 'Vocabulary']
                    );
                    const lessonId = res.insertId;

                    // Chèn 20 từ vào bảng Vocabulary
                    for (const item of chunks[i]) {
                        await connection.execute(
                            "INSERT INTO `Vocabulary` (LessonID, Word, Furigana, Meaning) VALUES (?, ?, ?, ?)",
                            [
                                lessonId,
                                item.kanji || item.kana, // Ưu tiên Kanji, nếu không có dùng Kana
                                item.kana,
                                item.waller_definition
                            ]
                        );
                    }
                }
                console.log(`✅ Đã nạp xong Vocabulary ${lvl}`);
            }
        }

        // --- 2. MIGRATION KANJI ---
        for (const lvl of levels) {
            const kanjiPath = path.join(__dirname, `../../data/kanji/${lvl.toUpperCase()}.json`);
            if (fs.existsSync(kanjiPath)) {
                const data = JSON.parse(fs.readFileSync(kanjiPath, 'utf8'));
                const chunks = chunkArray(data, 20);

                for (let i = 0; i < chunks.length; i++) {
                    const [res] = await connection.execute(
                        "INSERT INTO `Lesson` (JLPT_Level, Title, Type) VALUES (?, ?, ?)",
                        [lvl.toUpperCase(), `Kanji ${lvl.toUpperCase()} - Lesson ${i + 1}`, 'Kanji']
                    );
                    const lessonId = res.insertId;

                    for (const item of chunks[i]) {
                        await connection.execute(
                            "INSERT INTO `Kanji` (LessonID, `Character`, Onyomi, Kunyomi, Meaning) VALUES (?, ?, ?, ?, ?)",
                            [
                                lessonId,
                                item.kanjiChar,
                                item.onyomi.join(', '), // Chuyển mảng thành chuỗi
                                item.kunyomi.join(', '),
                                item.meanings.join(', ')
                            ]
                        );
                    }
                }
                console.log(`✅ Đã nạp xong Kanji ${lvl}`);
            }
        }

        // --- 3. MIGRATION ALPHABET (KANA) ---
        const alphabets = ['hiragana', 'katakana'];
        for (const type of alphabets) {
            const kanaPath = path.join(__dirname, `../../data/alphabet/${type}.json`);
            if (fs.existsSync(kanaPath)) {
                const data = JSON.parse(fs.readFileSync(kanaPath, 'utf8'));
                const chunks = chunkArray(data, 20);

                for (let i = 0; i < chunks.length; i++) {
                    // Mặc định Alphabet thuộc N5
                    const [res] = await connection.execute(
                        "INSERT INTO `Lesson` (JLPT_Level, Title, Type) VALUES (?, ?, ?)",
                        ['N5', `${type.charAt(0).toUpperCase() + type.slice(1)} - Bài ${i + 1}`, 'Kana']
                    );
                    const lessonId = res.insertId;

                    for (const item of chunks[i]) {
                        await connection.execute(
                            "INSERT INTO `Kana` (LessonID, `Character`, Romaji) VALUES (?, ?, ?)",
                            [lessonId, item.content, item.meaning]
                        );
                    }
                }
                console.log(`✅ Đã nạp xong Alphabet: ${type}`);
            }
        }

        console.log("🎉 Hoàn thành nạp dữ liệu thành công!");

    } catch (error) {
        console.error("❌ Lỗi trong quá trình migration:", error);
    } finally {
        await connection.end();
    }
}

migrateData();