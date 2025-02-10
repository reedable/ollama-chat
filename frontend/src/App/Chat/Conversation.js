export function transformConversation(json) {
  return {
    conversationId: json._id,
    exchanges: json.exchanges.map((exchange) => ({
      exchangeId: exchange._id,
      prompt: exchange.messages[0].content,
      answer: exchange.messages[1].content,
    })),
  };
}
