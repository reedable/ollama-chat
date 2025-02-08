import Conversation from '../models/Conversation.js';

export async function deleteExchange(req, res) {
  const { userId } = req.user;
  const { exchangeId } = req.body;

  const result = await Conversation.updateOne(
    { userId },
    { $pull: { messages: { exchangeId } } },
  );

  console.log(userId, exchangeId, result);
  res.end();
}
