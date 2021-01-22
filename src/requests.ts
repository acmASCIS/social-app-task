import { Router } from 'express';
import { connect as connector, connection } from 'mongoose';

import {
  newUser,
  getAllUsers,
  getUserById,
  updateAllById,
  updateById,
  deleteById,
} from './controllers/user';

import {
  createPost,
  getAllPosts,
  getPostsByUserId,
  updatePostById,
  deletePostById,
} from './controllers/post';

const connectDB = (
  callback: CallableFunction = null,
  createNew: boolean = false
) => {
  connector(
    process.env.DB_CONNECT,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    () => {
      connection.on('error', (err) => {
        console.error(`Mongoose connection error: ${err}`);
        process.exit(1);
      });

      if (createNew) {
        const newDB = () => connectDB(callback, false);
        connection.db.dropDatabase().then(newDB);

        return;
      }

      if (callback !== null) {
        callback();
      }
    }
  );
};

const userRoute = Router();
const postRoute = Router();

userRoute.get('/', getAllUsers);
userRoute.get('/:userId', getUserById);
userRoute.post('/', newUser);
userRoute.put('/:userId', updateAllById);
userRoute.patch('/:userId', updateById);
userRoute.delete('/:userId', deleteById);

postRoute.get('/', getAllPosts);
postRoute.get('/:userId', getPostsByUserId);
postRoute.post('/', createPost);
postRoute.put('/:postId', updatePostById);
postRoute.delete('/:postId', deletePostById);

export { userRoute, postRoute, connectDB };
