import { Conversation } from '../models/Schema.js';

export async function getConversation(req, res) {
  const { user } = req;

  res.setHeader('Content-Type', 'application/json');

  const conversation = await Conversation.findOne({
    userId: user._id,
  }).populate('exchanges');

  res.json(conversation);
}
