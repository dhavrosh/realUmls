import mongoose from 'mongoose';

const MessageSchema = {
  text: { type: String, required: true },
  authorId: String,
  authorName: String,
  createdAt: { type: Date, default: Date.now() }
};

const MemberSchema = new mongoose.Schema({
  email: { type: String, required: true },
  role: { type: String, required: true },
  key: { type: String, required: true }
});

const RoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: { type: String, required: true },
  members: [MemberSchema],
  messages: [MessageSchema],
  description: String,
  diagram: String,
  isVisible: {type: Boolean, default: false}
});

export default mongoose.model('Room', RoomSchema);