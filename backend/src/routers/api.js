import express from 'express';
import { getConversation } from '../controllers/conversation.js';
import { deleteExchange, postExchange } from '../controllers/exchange.js';
import prepareConversation from '../middlewares/prepareConversation.js';
import prepareExchange from '../middlewares/prepareExchange.js';
import sanitizePrompt from '../middlewares/sanitizePrompt.js';
import validateUserId from '../middlewares/validateUserId.js';

const router = express.Router();

router.use(validateUserId);

router.get('/user/conversation', prepareConversation, getConversation);

router.post(
  '/user/conversation/exchange',
  sanitizePrompt,
  prepareConversation,
  prepareExchange,
  postExchange,
);

router.delete('/user/conversation/exchange', deleteExchange);

export default router;
