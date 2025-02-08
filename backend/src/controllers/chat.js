import ollama from '../services/ollama.js';

export default async function chat(req, res) {
  const { MODEL_NAME } = process.env;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    const { conversation } = req;
    const { messages } = conversation;

    const { exchangeId, prompt } = req.body;
    const message = { exchangeId, role: 'user', content: prompt };

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
        response = {
          exchangeId,
          role: chunk.message.role,
          content: chunk.message.content,
        };
      }
    }

    // Strip out the reasoning from the history
    // When the reasoning is part of the history in the subsequent chat, the
    // response starts to incorporate the structure of the previous reasoning
    // in the final answer, and it is not pretty.
    const matches = response.content.match(
      /(<think>[\s\S]*<\/think>)([\s\S]*)/,
    );

    if (matches) {
      response.content = matches[2];
    }

    messages.push(response);
    res.end();
  } catch (error) {
    console.error('Error generating response', error);
    res.status(500).send('Error generating response');
  }
}
