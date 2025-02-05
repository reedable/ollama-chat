import ollama from '../services/ollama.js';
import Chat from '../models/Chat.js';

export default async (req, res) => {
  const { MODEL_NAME } = process.env;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    const { userId, conversationId, prompt } = req.body;

    // FIXME Validate and sanitize prompt
    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    // FIXME Validate conversationId
    // if (!conversationId) {
    //   return res.status(400).json({ error: 'conversationId is required' });
    // }

    const message = { role: 'user', content: prompt };

    // TODO Load conversation history by userId, conversationId
    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    let response = '';
    const { messages } = chat;

    messages.push(message);

    const stream = await ollama.chat({
      model: MODEL_NAME,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      res.write(chunk.message.content);
      if (response) {
        response.content += chunk.message.content;
      } else {
        response = { role: chunk.message.role, content: '' };
      }
    }

    res.end();
    messages.push(response);
    await chat.save();
  } catch (error) {
    console.error('Error generating response', error);
    res.status(500).send('Error generating response');
  }
};
