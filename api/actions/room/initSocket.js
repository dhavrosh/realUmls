import Room from '../../models/Room';
import mongoose from 'mongoose';

export default function initSocket(io, socket) {
  async function join(id) {
    let res = await Room.findById(id).select('-_id messages').lean();

    socket.join(id);
    socket.emit('INIT', res.messages || []);
  }

  async function message(id, data) {
    const options =  { safe: true, upsert: true };

    data._id = mongoose.Types.ObjectId();
    await Room.findByIdAndUpdate(id, { $push: { 'messages': data }}, options);

    io.in(id).emit('MESSAGE', data);
  }

  return {
    join,
    message
  }
}