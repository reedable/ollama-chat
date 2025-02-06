import express from 'express';
import chat, { loadConversation, sanitizePrompt } from '../controllers/chat.js';
import generate from '../controllers/generate.js';
import validateUserId from '../middlewares/validateUserId.js';

const router = express.Router();

router.use(validateUserId);

router.post('/chat', sanitizePrompt, loadConversation, chat);

router.post('/generate', generate);

export default router;
