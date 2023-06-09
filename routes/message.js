import { Router } from 'express';
import Message from '../models/message.js'
import Conversation from '../models/conversation.js'

const router = Router()
// Create a new conversation
// Create a new message
router.post('/', async (req, res) => {
  try {
    const { body } = req;
    const { from, to, text } = body
    const id = await getConversationId(req)
    const message = new Message({ conversation: id, from, to, text });
    const { _id } = message;
    await message.save();
    await updateConversationMessagesRefrences(id, _id);
    res.status(201).send(message);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all messages for a specific conversation
router.get('/:id', async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;
    console.log(id);
    const messages = await Message.
      find({ conversation: id }).
      populate('from').
      populate('to').
      exec();
    res.send(messages);
  } catch (error) {
    res.status(500).send(error);
  }
});

async function getConversationId(req) {
  const { body } = req;
  const { from, to } = body
  const conversationList = await Conversation.find({
    'users': {
      $all: [from, to]
    }
  })

  if (conversationList && conversationList.length > 1) {
    const [item] = conversationList
    const { _id } = item;
    return _id;
  }
  const conversation = new Conversation({ users: [from, to] })
  await conversation.save();
  const { _id } = conversation;
  return _id
}

async function updateConversationMessagesRefrences(conversationId, messageId) {
  const conversationList = await Conversation.findByIdAndUpdate(conversationId, { $push: { messages: messageId } });
  await conversationList.save();
}

export default router;
