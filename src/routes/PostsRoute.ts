import express from "express";
import { addPost, deletePost, getPosts, updatePost } from '../controller/PostController';
import upload from "../middlwares/MulterMiddleWare";




const postsRoute = express.Router();


postsRoute.post('',upload.single('image'),addPost);

postsRoute.put('/:postId',updatePost);

postsRoute.delete('/:postId',deletePost);

postsRoute.get('',getPosts);

export default postsRoute;