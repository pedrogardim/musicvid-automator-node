import express from 'express';
import { addSong, getSong, searchSong } from '../controllers/songController.js';

const router = express.Router();

router.post('/', addSong);
router.get('/', getSong);
router.get('/search/:query', searchSong);

export default router;
