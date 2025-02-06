export default async function sanitizePrompt(req, res, next) {
  // TODO Validate and sanitize prompt
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  next();
}
