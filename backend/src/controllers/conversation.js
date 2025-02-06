export async function getConversation(req, res) {
  res.setHeader('Content-Type', 'application/json');

  res.json({
    messages: req.conversation.messages,
  });
}
