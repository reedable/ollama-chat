import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: String,
  conversationId: String,
  messages: [
    {
      role: String, // "user" or "assistant"
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model('Chat', chatSchema);
