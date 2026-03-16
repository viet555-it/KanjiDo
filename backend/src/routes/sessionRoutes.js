import express from 'express';
import { createSession, saveStatistic } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/create', createSession);
router.post('/save-statistic', saveStatistic);

export default router;