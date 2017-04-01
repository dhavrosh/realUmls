import initChatRoomSocket from './chatRoom/initSocket';

export default function initializeSockets(io) {
  io.on('connection', socket => {
    const chatRoom = initChatRoomSocket(io, socket);

    socket.on('JOIN_ROOM', chatRoom.join);
    socket.on('MESSAGE', chatRoom.message);
  });
}