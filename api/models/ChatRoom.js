import mongoose from 'mongoose';

const ChatRoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  creator: { type: String, required: true }
});

mongoose.model('ChatRoom', ChatRoomSchema);

export default mongoose.model('ChatRoom');