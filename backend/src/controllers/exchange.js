import { v4 as uuidv4 } from 'uuid';
import { Conversation, Exchange } from '../models/Schema.js';
import ollama from '../services/ollama.js';

export async function postExchange(req, res) {
  const { MODEL_NAME } = process.env;
  const boundary = uuidv4();

  res.setHeader(`Content-Type`, `multipart/mixed; boundary=${boundary}`);
  res.setHeader('Transfer-Encoding', 'chunked');

  // Acknowledge the receipt of the prompt with the new exchangeId

  try {
    res.write(`--${boundary}\r\n`);
    res.write('Content-Type: application/json\r\n');
    res.write('\r\n'); //end of headers
    res.write(`${JSON.stringify(req.exchange)}\r\n`);
  } catch (error) {
    console.error('Error while sending exchange', error);
  }

  // Load the last 12 exchanges from the conversation
  try {
    await req.conversation.populate({
      path: 'exchanges',
      options: { sort: { _id: -1 }, limit: 12 },
    });
  } catch (error) {
    console.error('Error while loading chat history', error);
  }

  // Query the LLM and stream AI assistant response
  // TODO if (deepseek-R1) split <think> into multipart message

  try {
    res.write(`--${boundary}\r\n`);
    res.write('Content-Type: text/plain\r\n');
    res.write('\r\n'); //end of headers

    const prompt = req.exchange.messages[0].content;

    const messages = req.conversation.exchanges
      .reverse()
      .map((exchange) => exchange.messages)
      .flat()
      .map((message) => ({ role: message.role, content: message.content }))
      .concat({ role: 'user', content: prompt });

    const stream = await ollama.chat({
      model: MODEL_NAME,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      res.write(chunk.message.content);
      req.exchange.messages[1].content += chunk.message.content;
    }

    res.write('\r\n');
  } catch (error) {
    console.error('Error generating response', error);
  } finally {
    req.exchange.save();
  }

  res.write(`--${boundary}--`);
  res.end();
}

export async function deleteExchange(req, res) {
  const { exchangeId } = req.body;

  if (!exchangeId) {
    return res.status(400).end();
  }

  const exchange = await Exchange.findOne({
    _id: exchangeId,
    conversationId: { $in: req.user.conversations },
  });

  if (!exchange) {
    return res.status(404).end();
  }

  await Exchange.deleteOne({ _id: exchange._id });

  await Conversation.updateOne(
    { _id: exchange.conversationId },
    { $pull: { exchanges: exchange._id } },
  );

  return res.status(200).end();
}
