import mongoose from 'mongoose';

const ExchangeSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  messages: [
    {
      role: String,
      content: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const ConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exchanges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exchange' }],
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  conversations: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  ],
});

export const User = mongoose.model('User', UserSchema);
export const Conversation = mongoose.model('Conversation', ConversationSchema);
export const Exchange = mongoose.model('Exchange', ExchangeSchema);
