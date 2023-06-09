import { Schema, model } from 'mongoose';

// Create Schema for Users
const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  online: { type: Boolean, required: false },
  socketId: { type: String, required: false },
});

export default model('User', UserSchema);
