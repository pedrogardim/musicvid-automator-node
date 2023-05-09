import express from 'express';
import { addSong, getSong, searchSong } from '../controllers/songController.js';

const router = express.Router();

router.put('/', addSong);
router.get('/', getSong);
router.get('/search/:query', searchSong);

export default router;
