import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import './db/connection.js';
import user from './routes/user.js'
import conversation from './routes/conversation.js'
import message from './routes/message.js'
import login from './routes/login.js'
import initSocket from './socket-io/socket.js';

const app = express();
const httpServer = createServer(app);
initSocket(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());

app.get('/', (req, res) => {
  res.send('ES6 is the Node way to go');
})

app.use('/user', user)
app.use('/conversation', conversation)
app.use('/message', message)
app.use('/login', login)


httpServer.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
})

export default app;
