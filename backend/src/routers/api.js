import express from 'express';
import chat from '../controllers/chat.js';
import generate from '../controllers/generate.js';
import loadConversation from '../middlewares/loadConversation.js';
import sanitizePrompt from '../middlewares/sanitizePrompt.js';
import validateUserId from '../middlewares/validateUserId.js';
import { getConversation } from '../controllers/conversation.js';

const router = express.Router();

router.use(validateUserId);

// Ollama API
router.post('/chat', sanitizePrompt, loadConversation, chat);
router.post('/generate', sanitizePrompt, generate);

// MongoDB API
router.get('/conversation', loadConversation, getConversation);

export default router;
