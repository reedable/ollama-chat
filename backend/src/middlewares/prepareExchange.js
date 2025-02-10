import { Conversation, Exchange } from '../models/Schema.js';

export default async function prepareExchange(req, res, next) {
  const { conversation } = req;
  const { prompt } = req.body;

  const messages = [
    { role: 'user', content: prompt },
    { role: 'assistant', content: '' },
  ];

  const exchange = new Exchange({
    conversationId: conversation._id,
    messages,
  });

  await exchange.save();

  await Conversation.findByIdAndUpdate(conversation._id, {
    $push: { exchanges: exchange._id },
  });

  req.exchange = exchange;

  next();
}
