import Conversation from '../models/Conversation.js';

export default async function loadConversation(req, res, next) {
  try {
    const { userId, conversationId } = req.body;

    // TODO Load conversation history by userId, conversationId
    let conversation = await Conversation.findOne({ userId });

    if (!conversation) {
      conversation = new Conversation({ userId, messages: [] });
    }

    req.conversation = conversation;

    res.on('finish', () => {
      conversation.messages.splice(0, conversation.messages.length - 8);
      conversation.save();
    });

    next();
  } catch (e) {
    // FIXME #1 Gracefully switch to /generate if MongoDB is unavailable
    throw e;
  }
}
