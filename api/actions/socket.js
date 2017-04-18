import initRoomSocket from './room/initSocket';

export default function initializeSockets(io) {
  io.on('connection', socket => {
    const room = initRoomSocket(io, socket);

    socket.on('JOIN_ROOM', room.join);
    socket.on('MESSAGE', room.message);
    socket.on('DIAGRAM', room.diagram);
  });
}