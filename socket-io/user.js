import User from '../models/user.js'
import events from './events.js';

const { USER_ONLINE } = events;

export const setUserOnline = (username, socketId) => {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({
      username
    }, {
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

export const getOnlineUser = (username) => {
  return new Promise((resolve, reject) => {
    User.findOne({
      username,
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

export const userOnlineSocket = (io, socket) => async (username) => {
  try {
    await setUserOnline(username, socket.id);
    io.emit(USER_ONLINE, username);
  } catch (error) { }
};

export const userOfflineSocket = async () => {
  try {
    await setUserOffline(socket.id);
  } catch (error) {
  }
}