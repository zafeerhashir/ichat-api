import { Router } from 'express';
import Conversation from '../models/conversation.js'

const router = Router() // Create a new conversation

router.post('/', async (req, res) => {
  try {
    const conversation = new Conversation(req.body);
    await conversation.save();
    res.status(201).send(conversation);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all conversations
router.get('/:id', async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;
    const conversations = await Conversation.
      find({ users: { $in: [id] } }).
      populate('users').
      exec();
    res.send(conversations);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.
      find().
      populate('users').
      populate('messages').
      exec();
    res.send(conversations);
  } catch (error) {
    res.status(500).send(error);
  }
});


export default router;
