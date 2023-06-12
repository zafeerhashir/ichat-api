import Message from '../models/message.js'
import Conversation from '../models/conversation.js'
import User from '../models/user.js'
import events from './events.js';

const { PRIVATE_MESSAGE } = events;

export const saveMessage = async (from, to, text) => {
  try {
    const [fromUser, toUser] = await User.find({ username: { $in: [from, to] } });
    const id = await getConversationId(fromUser._id, toUser._id)
    const message = new Message({ conversation: id, from: fromUser._id, to: toUser._id, text });
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

export const privateMessage = async (usernameFrom, usernameTo, message) => {
  try {
    await saveMessage(usernameFrom, usernameTo, message);
    const user = await getOnlineUser(usernameTo);
    io.to(user.socketId).emit(PRIVATE_MESSAGE, usernameFrom, usernameTo, message);
  } catch (error) {
  }
}