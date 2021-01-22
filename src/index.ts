import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import bodyparser from 'body-parser';

import { userRoute, postRoute, connectDB } from './requests';

dotenv.config();

const app = express();
const port = process.env.localhost || 3000;

const message = `listening to port ${port}, url: http://localhost:${port}/`;

// temp
const createNewDB = true;
const isConnected = () => console.log('db is connected');

connectDB(isConnected, createNewDB);

app.get('/', (req: Request, res: Response) => {
  res.send('now you can see me');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyparser.json());

app.use('/users', userRoute);
app.use('/posts', postRoute);

const onListen = () => {
  console.log(message);
};

app.listen(port, onListen);
