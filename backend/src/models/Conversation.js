import mongoose from 'mongoose';

// The conversation model in the backend is less structured than the one in the
// UI. UI pairs each call-and-response (user/assistant) pair into "exchange"
// object, but in the backend, the whole conversation is represented as a flat
// list.

const conversationSchema = new mongoose.Schema({
  userId: String,
  conversationId: String,
  messages: [
    {
      exchangeId: String,
      role: String, // "user" or "assistant"
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model('Conversation', conversationSchema);
