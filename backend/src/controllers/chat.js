import ollama from '../services/ollama.js';
import Conversation from '../models/Conversation.js';

export async function sanitizePrompt(req, res, next) {
  // TODO Validate and sanitize prompt
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  next();
}

export async function loadConversation(req, res, next) {
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

export default async (req, res) => {
  const { MODEL_NAME } = process.env;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    const { conversation } = req;
    const { messages } = conversation;

    const { prompt } = req.body;
    const message = { role: 'user', content: prompt };

    messages.push(message);

    const stream = await ollama.chat({
      model: MODEL_NAME,
      messages,
      stream: true,
    });

    let response = '';

    for await (const chunk of stream) {
      res.write(chunk.message.content);
      if (response) {
        response.content += chunk.message.content;
      } else {
        response = { role: chunk.message.role, content: chunk.message.content };
      }
    }

    messages.push(response);
    res.end();
  } catch (error) {
    console.error('Error generating response', error);
    res.status(500).send('Error generating response');
  }
};
