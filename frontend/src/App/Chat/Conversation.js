export function messagesToConversation(messages) {
  return messages
    .reduce((exchanges, message) => {
      if (message.role === 'user') {
        exchanges.push({
          exchangeId: message.exchangeId,
          prompt: message.content,
        });
      } else {
        const lastExchange = exchanges[exchanges.length - 1];

        if (lastExchange) {
          lastExchange.answer = message.content;
        }
      }

      return exchanges;
    }, [])
    .filter((e) => e.answer);
}
