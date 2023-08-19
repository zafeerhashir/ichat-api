import Message from '../models/message.js'
import Conversation from '../models/conversation.js'
import User from '../models/user.js'
import events from './events.js';
import { getOnlineUser } from './user.js'

const { PRIVATE_MESSAGE } = events;

export const saveMessage = async (fromUserId, toUserId, text) => {

  try {
    const id = await getConversationId(fromUserId, toUserId)
    const message = new Message({ conversation: id, from: fromUserId, to: toUserId, text });
    const { _id } = message;
    await message.save();
    await updateConversationMessagesRefrences(id, _id);
  } catch (error) {
  }
}

const getConversationId = async (from, to) => {
  const conversationList = await Conversation.find({
    users: {
      $all: [from, to]
    }
  })

  if (conversationList && conversationList.length > 0) {
    const [item] = conversationList
    const { _id } = item;
    return _id;
  }

  const conversation = new Conversation({ users: [from, to] })
  await conversation.save();
  const { _id } = conversation;
  return _id
}

const updateConversationMessagesRefrences = async (conversationId, messageId) => {
  const conversationList = await Conversation.findByIdAndUpdate(conversationId, { $push: { messages: messageId } });
  await conversationList.save();
}

export const privateMessage = (io) => async (userIdFrom, userIdTo, message) => {
  try {
    await saveMessage(userIdFrom, userIdTo, message);
    const user = await getOnlineUser(userIdTo);
    if (user.socketId) {
      io.to(user.socketId).emit(PRIVATE_MESSAGE, userIdFrom, userIdTo, message);
    }
  } catch (error) {
  }
}