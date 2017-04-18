import Room from '../../models/Room';
import mongoose from 'mongoose';

export default function initSocket(io, socket) {
  const options =  { safe: true, upsert: true };

  async function join(id) {
    // let res = await Room.findById(id).select('-_id messages').lean();
    socket.join(id);
    socket.emit('INIT');
  }

  // TODO: remove await
  async function message(id, data) {
    data._id = mongoose.Types.ObjectId();

    await Room.findByIdAndUpdate(id, { $push: { 'messages': data }}, options);

    io.in(id).emit('MESSAGE', data);
  }

  async function diagram(id, diagram) {
    await Room.findByIdAndUpdate(id, { diagram }, options);

    socket.broadcast.to(id).emit('DIAGRAM', diagram);
  }

  return {
    join,
    message,
    diagram
  }
}