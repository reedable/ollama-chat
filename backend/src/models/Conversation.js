import mongoose from 'mongoose';

//TODO Rename this to Conversation

const conversationSchema = new mongoose.Schema({
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

export default mongoose.model('Conversation', conversationSchema);
