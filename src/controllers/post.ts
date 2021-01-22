import { Request, Response } from 'express';

import imageToBase64 from 'image-to-base64';

import { User } from '../model/User';
import { Post } from '../model/Post';

const compDate = (a: any, b: any) => {
  return a.created_at.localeCompare(b.created_at);
};

const createPost = async (req: Request, res: Response) => {
  
  const id = req.query.userId;
  const user = await User.findOne({ id: id });

  const { text, imagePath } = req.body;
  let encodedImage = null;

  if (imagePath){
  
     encodedImage = await imageToBase64(imagePath);
  }

  const postId = (await Post.find({})).length + 1;

  try {
    const post = await new Post({
      user: user._id,
      id: postId,
      text: text,
      image: encodedImage
    }).save();

    if (post) {
      return res.status(200).json({
        post: post,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      error: err.message,
    });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  

  try {

    const postsList = await Post.find({});

    const posts = {};

    for (let i = 0; i < postsList.length; i++){
        posts[i] = postsList[i];
    }

    if (posts) {
      return res.status(200).json({posts: posts});
    }
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      error: err.message,
    });
  }
};

const getPostsByUserId = async (req: Request, res: Response) => {
  
  const id = req.query.userId;
  const user = await User.findOne({ id: id });

  if (!user) {
    return res.status(422).json({ error: "user, doesn't exist" });
  }

  try {
    const postsList = await Post.find({ user: user._id });

    postsList.sort(compDate);

    const posts = {};

    for (let i = 0; i < postsList.length; i++) {
      posts[i] = postsList[i];
    }

    if (posts) {
      return res.status(200).json(posts);
    }
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      error: err.message,
    });
  }
};

// put
const updatePostById = async (req: Request, res: Response) => {
  try {
    const id = req.params.postId;

    const post: any = await Post.findOne({ id: id });

    if (!post) {
      return res.status(422).json({ error: "post, doesn't exist" });
    }

    const _id = post.user;
    const text = req.body.text;

    Post.updateOne({ id: id }, { user: _id, text })
      .then((modified) => {
        return res.status(200).json({
          modified: modified,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: 'error',
          error: err.message,
        });
      });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      error: err.message,
    });
  }
};

// delete
const deletePostById = async (req: Request, res: Response) => {
  try {
    const id = req.params.postId;

    const post: any = await Post.findOne({ id: id });

    if (!post) {
      return res.status(422).json({ error: "post, doesn't exist" });
    }

    Post.deleteOne({ id: id })
      .then((deleted) => {
        return res.status(200).json({
          deleted: deleted,
          post: post,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: 'error',
          error: err.message,
        });
      });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      error: err.message,
    });
  }
};

export {
  createPost,
  getAllPosts,
  getPostsByUserId,
  updatePostById,
  deletePostById,
};
