import express from 'express';
import Post from '../Model/Post';



const addPost = async (req: express.Request, res: express.Response) => {
    const { body, create_by } = req.body;
    if (!body || !create_by)
        return res.json({
            status: "Failed",
            error: "please check for all the fields",
        });

    const newPost = await new Post({ body, create_by, image: req.file }).save();
    if (!newPost)
        return res.json({
            status: "Failed",
            error: "Something went wrong",
        })
    else
        return res.json({
            post: newPost
        })
}

const updatePost = async (req: express.Request, res: express.Response) => {
    const postId = req.params.postId;
    const { body } = req.body;
    if (!body)
        return res.json({
            status: "Failed",
            error: "please check for the body",
        });

    const updatedPost = await Post.findByIdAndUpdate(postId, { body });

    if (!updatedPost) {
        return res.json({
            status: "Failed",
            error: "please check for post Id",
        })
    }
    else {
        return res.json({
            post: updatedPost
        })
    }
}

const getPosts = async (req: express.Request, res: express.Response) => {
    let userId = req.query.userId;
    let posts;
    if (!userId) {
        posts = await Post.find().sort({ created_at: -1 });
    }
    else {
        posts = await Post.find({ create_by: userId }).sort({ created_at: -1 });
    }
    if (!posts)
        return res.json({
            posts: []
        })
    else
        return res.json({
            posts
        })
}

const deletePost = async (req: express.Request, res: express.Response) => {
    const postId = req.params.postId;
    const deletedPost = await Post.findByIdAndRemove(postId);
    if (!deletedPost)
        return res.json({
            status: "Failed",
            error: "Please Enter Valid Post Id",
        });
    else {
        return res.json({
            status: 'Success',
            message: 'Post Deleted Successfully'
        })
    }
}


export { addPost, updatePost, getPosts, deletePost };