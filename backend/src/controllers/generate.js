import ollama from '../services/ollama.js';

export default async (req, res) => {
  const { MODEL_NAME } = process.env;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    const { prompt } = req.body;

    // FIXME Validate and sanitize prompt

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const stream = await ollama.generate({
      model: MODEL_NAME,
      prompt,
      stream: true,
    });

    for await (const chunk of stream) {
      res.write(chunk.response);
    }

    res.end();
  } catch (error) {
    console.error('Error generating response', error);
    res.status(500).send('Error generating response');
  }
};
