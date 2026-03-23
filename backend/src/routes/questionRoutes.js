import express from 'express';
import { getQuestions, getQuizzes } from '../controllers/questionController.js';

const router = express.Router();

// Get questions for a specific quiz (e.g. /api/questions/1)
router.get('/:quizId', getQuestions);

// List available quizzes, item can be filtered by lessonId (e.g. /api/questions)
router.get('/', getQuizzes);

export default router;