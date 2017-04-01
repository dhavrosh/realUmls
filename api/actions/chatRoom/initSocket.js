/*function Room(id, bufferSize) {
  this.id = id;
  this.sockets = [];
  this.bufferSize = bufferSize;
  this.messages = new Array(bufferSize);
  this.messageIndex = 0;
  this.addSocket = socket => this.sockets.push(socket);
  this.getId = () => this.id;
  this.getMessages = () => this.messages;
  this.addMessage = message => {
    message.id = this.messageIndex;
    this.messages[this.messageIndex % this.bufferSize] = message;
    this.messageIndex++;
  };
}

function Rooms() {
  this.rooms = [];
  this.getBySocket = socket => this.rooms.find(room => room.sockets.indexOf(socket) > -1);
  this.getById = id => this.rooms.find(room => room.id === id);
  this.create = (id, socket) => {
    const room = new Room(id, 100);
    room.addSocket(socket);
    this.rooms.push(room);
    return room;
  }
}

const rooms = new Rooms();*/

import ChatRoom from '../../models/ChatRoom';
import mongoose from 'mongoose';

export default function initSocket(io, socket) {
  async function join(id) {
    let res = await ChatRoom.findById(id).select('-_id messages').lean();

    socket.join(id);
    socket.emit('INIT', res.messages || []);
  }

  async function message(id, data) {
    const options =  { safe: true, upsert: true };

    data._id = mongoose.Types.ObjectId();
    await ChatRoom.findByIdAndUpdate(id, { $push: { 'messages': data }}, options);

    io.in(id).emit('MESSAGE', data);
  }

  return {
    join,
    message
  }
}