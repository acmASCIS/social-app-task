import express from "express";
import { createUser, deleteUser, getUser, getUsers, replaceUser, updateUser } from '../controller/UserController';

const userRoute = express.Router();


userRoute.post('', createUser);

userRoute.put('/:userId', replaceUser);

userRoute.patch('/:userId', updateUser);

userRoute.get('', getUsers);

userRoute.get('/:userId', getUser);

userRoute.delete('/:userId', deleteUser);

export default userRoute;