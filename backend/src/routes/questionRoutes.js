import express from 'express';
import { getQuestions, getUnits } from '../controllers/questionController.js';

const router = express.Router();

router.get('/', getQuestions);
router.get('/units', getUnits);

export default router;