import { Conversation, User } from '../models/Schema.js';
import logger from '../services/logger.js';

export default async function prepareConversation(req, res, next) {
  const { user } = req;
  let conversation = null;

  if (user.conversations.length === 0) {
    // Start a new Conversation
    logger.info('Start a new Conversation');
    conversation = new Conversation({ userId: user._id, exchanges: [] });
    await conversation.save();
    await User.findByIdAndUpdate(user._id, {
      $push: { conversations: conversation._id },
    });
  } else {
    logger.info('Continue the last Conversation');
    user.populate('conversations');
    conversation = user.conversations[0];
  }

  // await Exchange.deleteMany({ conversationId: conversation._id });

  // Pick up the last conversation
  const lastConversation = user.conversations[user.conversations.length - 1];

  logger.debug('Continue the last Conversation', lastConversation);

  req.conversation = await Conversation.findById(lastConversation._id);

  next();
}
