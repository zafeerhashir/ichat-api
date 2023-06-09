import { Schema, model } from 'mongoose';

// Create Schema for Users
const ConversationSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  createdAt: { type: Date, default: Date.now },
});

export default model('Conversation', ConversationSchema);
