import mongoose from 'mongoose';
import User from './User';

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

RoomSchema.pre('save', async function(next) {
  const oldRoom = await mongoose.model('Room').findById(this._id).lean();

  if (oldRoom) {
    const keys = getMembersToRemove(oldRoom.members, this.members).map(member => member.key);
    await removeKeysFromMembers(keys);
  }

  next();
});

RoomSchema.pre('remove', async function(next) {
  const keys = this.members.map(member => member.key);
  await removeKeysFromMembers(keys);

  next();
});

function getMembersToRemove(oldMembers, receivedMembers) {
  return oldMembers.filter(receivedMember => {
    return typeof receivedMembers.find(oldMember => oldMember.email === receivedMember.email) === 'undefined';
  });
}

async function removeKeysFromMembers(keys) {
  const users = await User.find({'keys.value': {'$in': keys}});

  users.forEach(user => {
    user.keys = user.keys.filter(key => keys.indexOf(key.value) === -1);
    user.save();
  });
}

export default mongoose.model('Room', RoomSchema);