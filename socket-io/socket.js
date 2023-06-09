import { Server } from "socket.io";
import events from './events.js';
import { setUserOnline, setUserOffline, getOnlineUser } from './user.js'
import { saveMessage } from './message.js'

const { CONNECTION, DISCONNECT, PRIVATE_MESSAGE, USER_ONLINE } = events;

function initSocket(httpServer) {

  const io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  });

  io.on(CONNECTION, (socket) => {

    socket.on(USER_ONLINE, async (username) => {
      try {
        await setUserOnline(username, socket.id);
        io.emit(USER_ONLINE, username);
      } catch (error) {
      }
    });

    socket.on(PRIVATE_MESSAGE, async (usernameFrom, usernameTo, message) => {
      try {
        await saveMessage(usernameFrom, usernameTo, message);
        const user = await getOnlineUser(usernameTo);
        io.to(user.socketId).emit(PRIVATE_MESSAGE, usernameFrom, usernameTo, message);
      } catch (error) {
      }
    });

    socket.on(DISCONNECT, async () => {
      try {
        await setUserOffline(socket.id);
      } catch (error) {
      }
    });

  });
}

export default initSocket;
