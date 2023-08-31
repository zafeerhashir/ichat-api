import { Server } from "socket.io";
import events from './events.js';
import { userOnlineSocket, userOfflineSocket, userTypingSocket } from './user.js'
import { privateMessage } from './message.js'

const { CONNECTION, DISCONNECT, PRIVATE_MESSAGE, USER_ONLINE, USER_TYPING } = events;

function initSocket(httpServer) {

  const io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  });

  io.on(CONNECTION, (socket) => {
    socket.on(USER_ONLINE, userOnlineSocket(io, socket));
    socket.on(PRIVATE_MESSAGE, privateMessage(io));
    socket.on(DISCONNECT, userOfflineSocket(socket));
    socket.on(USER_TYPING, userTypingSocket(io));
  });
}

export default initSocket;
