import Conversation from '../models/Conversation.js';

export async function getConversation(req, res) {
  const { userId } = req.user;

  res.setHeader('Content-Type', 'application/json');

  let conversation = await Conversation.findOne({ userId });

  res.json({ messages: conversation.messages });
}
