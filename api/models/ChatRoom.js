import mongoose from 'mongoose';

const MessageSchema = {
  text: { type: String, required: true },
  author: String,
  createdAt: { type: Date, default: Date.now() }
};

const ChatRoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  creator: { type: String, required: true },
  messages: [MessageSchema]
});

export default mongoose.model('ChatRoom', ChatRoomSchema);