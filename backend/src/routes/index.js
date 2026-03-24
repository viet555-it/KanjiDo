import express from 'express';
import authRoutes from './authRoutes.js';
import contentRoutes from './contentRoutes.js';
import progressRoutes from './progressRoutes.js';
import questionRoutes from './questionRoutes.js';
import sessionRoutes from './sessionRoutes.js';

const router = express.Router();

// Mount individual route modules onto their specific paths
router.use('/auth', authRoutes);
router.use('/questions', questionRoutes);
router.use('/sessions', sessionRoutes);
router.use('/progress', progressRoutes);
router.use('/', contentRoutes); // contentRoutes contains root paths like /lessons, /kana, /kanji, /vocab

export default router;
