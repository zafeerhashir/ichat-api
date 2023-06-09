import { connect, set } from 'mongoose';

(async () => {
  try {
    set('strictQuery', true)
    await connect(process.env.DB).catch(error => console.log(error));
  }
  catch (e) {
    console.error(e);
  }
})()
