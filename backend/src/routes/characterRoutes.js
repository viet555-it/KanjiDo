import express from 'express';
import { getGroup, getCharactersByGroup } from '../controllers/characterController.js';

const router = express.Router();

router.get('/groups', getGroup);
router.get('/quiz', getCharactersByGroup);

export default router;