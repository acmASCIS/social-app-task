import express from "express";
import asyncHandler from 'express-async-handler';
import fs from "fs-extra";
import Post from '../models/post';

// post functions
const post = {

    createNewPost: (asyncHandler(async (req: express.Request, res: express.Response) => {
        const userID = req.params.userID;

        var post = req.body;
        post.created_by = userID;
        if (req.file != undefined) {
            post.image_URL = req.file.path;
        }

        post = await Post.create(post);
        res.json(post);
    })),

    replacePost: (asyncHandler(async (req: express.Request, res: express.Response) => {
        const oldPostID = req.params.postID;
        const oldImgPath = (await Post.findOne({ "_id": oldPostID })).image_URL;

        if (oldImgPath != undefined) {
            await fs.remove(oldImgPath);
        }

        const newPost = req.body;
        if (req.file != undefined) {
            newPost.image_URL = req.file.path;
        }
        newPost.created_by = (await Post.findOne({ "_id": oldPostID })).created_by;

        await Post.replaceOne({ "_id": oldPostID }, newPost);
        res.json('Post replaced successfully.');
    })),

    updatePost: (asyncHandler(async (req: express.Request, res: express.Response) => {
        const postID = req.params.postID;
        const post = await Post.findOne({ "_id": postID });

        const updates = req.body;
        if (req.file != undefined) {

            const oldImgPath = (await Post.findOne({ "_id": postID })).image_URL;
            if (oldImgPath != undefined) {
                await fs.remove(oldImgPath);
            }
            updates.image_URL = req.file.path;
        }

        const updatedPost = {
            ...post.toObject(),
            ...updates
        }

        await Post.updateOne({ "_id": postID }, updatedPost);
        res.json('Post updated successfully.');
    })),

    getAllPosts: (asyncHandler(async (_req: express.Request, res: express.Response) => {
        const posts = await Post.find({}).sort({ "createdAt": -1 });
        res.json(posts);
    })),

    getSpecificPost: (asyncHandler(async (req: express.Request, res: express.Response) => {
        const userID = req.params.userID;

        const posts = await Post.find({ "created_by": userID }).sort({ "createdAt": -1 });
        res.json(posts);
    })),

    deletePost: (asyncHandler(async (req: express.Request, res: express.Response) => {
        const postID = req.params.postID;

        if (await Post.exists({ "_id": postID })) {

            const oldImgPath = (await Post.findOne({ "_id": postID })).image_URL;
            if (oldImgPath != undefined) {
                await fs.remove(oldImgPath);
            }
            await Post.deleteOne({ "_id": postID });
            res.json('Post deleted successfully.');
        }
        else {
            res.json('Post not found.');
        }

    }))

}

export default post;
