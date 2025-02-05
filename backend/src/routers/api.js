import express from 'express';
import chat from '../controllers/chat.js';
import generate from '../controllers/generate.js';
import validateUserId from '../middlewares/validateUserId.js';

const router = express.Router();

router.use(validateUserId);
router.post('/chat', chat);
router.post('/generate', generate);

export default router;
