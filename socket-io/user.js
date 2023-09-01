import User from '../models/user.js'
import events from './events.js';

const { USER_ONLINE, PRIVATE_MESSAGE, USER_TYPING } = events;

export const setUserOnline = (userId, socketId) => {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(userId, {
      online: true,
      socketId
    }, {
      new: true
    }, (error) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  })
};

export const setUserOffline = (socketId) => {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({
      socketId
    }, {
      online: false,
      socketId: ''
    }, {
      new: true
    }, (error) => {
      if (error) {
        reject(error);
      }
      resolve();
    })
  })
};

export const getOnlineUser = (userId) => {
  return new Promise((resolve, reject) => {
    User.findOne({
      _id: userId,
      online: true
    }, (error, result) => {
      if (error) {
        reject(error);
      }
      if (!result || Object.keys(result).length === 0) {
        reject('error');
      }
      resolve(result);

    })
  })
};

export const userOnlineSocket = (io, socket) => async (userId) => {
  try {
    await setUserOnline(userId, socket.id);
    socket.join(userId)
    io.emit(USER_ONLINE, userId);
    socket.broadcast.emit(USER_ONLINE, userId)
  } catch (error) { }
};

export const userOfflineSocket = (socket) => async () => {
  try {
    await setUserOffline(socket.id);
  } catch (error) {
  }
}

export const userTypingSocket = (io) => async (userIdTo, typing) => {
  try {
    io.to(userIdTo).emit(USER_TYPING, typing);
  } catch (error) { }
};