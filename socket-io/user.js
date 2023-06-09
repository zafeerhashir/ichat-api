import User from '../models/user.js'

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
      if (Object.keys(result).length === 0) {
        reject('error');
      }
      resolve(result);

    })
  })
};
