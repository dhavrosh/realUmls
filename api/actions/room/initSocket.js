import User from '../../models/User';
import Room from '../../models/Room';
import mongoose from 'mongoose';

export default function initSocket(io, socket) {
  const options =  { safe: true, upsert: true };

  async function join(id) {
    socket.join(id);
    socket.emit('INIT');
  }

  async function message(id, data) {
    const author = await User.findById(data.authorId).select('-_id username').lean();
    const messageId = mongoose.Types.ObjectId().toString();
    const msg = {...data, authorName: author.username, _id: messageId };

    io.in(id).emit('MESSAGE', msg);

    await Room.findByIdAndUpdate(id, { $push: { 'messages': msg }}, options);
  }

  async function diagram(id, diagram) {
    socket.broadcast.to(id).emit('DIAGRAM', diagram);
    await Room.findByIdAndUpdate(id, { diagram }, options);
  }

  return {
    join,
    message,
    diagram
  }
}