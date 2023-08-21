import { Router } from 'express';
import User from '../models/user.js'

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { body } = req;
    const { username } = body
    const user = await User.findOne({ username: username.toLowerCase() });
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;