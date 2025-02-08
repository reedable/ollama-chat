import Conversation from '../models/Conversation.js';

// FIXME #1 Gracefully switch to /generate if MongoDB is unavailable
export default async function loadConversation(req, res, next) {
  const { userId } = req.user;
  const { conversationId } = req.body;

  // await Conversation.deleteOne({ userId });

  // TODO Load conversation history by userId, conversationId
  let conversation = await Conversation.findOne({ userId });

  if (!conversation) {
    conversation = new Conversation({ userId, messages: [] });
  }

  // TODO Separate the full conversation from the "chat history" we pass into
  //      /chat end point as an argument. The latter should take the user's
  //      likes and dislikes into account. The deleted exchanges should not
  //      appear here. User initiated deletion of exchanges will need to be
  //      handled with its own API.
  req.conversation = conversation;

  res.on('finish', () => {
    conversation.messages.splice(0, conversation.messages.length - 8);
    conversation.save();
  });

  next();
}
