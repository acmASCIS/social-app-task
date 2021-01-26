import express from 'express';
import fs from 'fs';
const User = require('../dbSchema/user');
const Post = require('../dbSchema/post');

async function DeletePost(deletedPost : any, req : express.Request, res : express.Response){
    fs.unlink(deletedPost.toObject()["Image"],(err)=>{
      if(err)
        console.log(err);
    });
    return await Post.deleteOne({_id : deletedPost.toObject()["_id"]});
}

module.exports = {
    AddUser : async (req: express.Request, res: express.Response)=>{
        const oldUser = await User.findOne({Email : req.body["Email"]});
        if(oldUser != null){
          res.json({"Error" : "Failed To Insert The User", "MSG" : "Thier Is A User With That Email"});
          return;
        }
        const newUser = new User(req.body);
        newUser["CreatedAt"] = new Date();
        await newUser.save();
        res.json(newUser).status(201);
    },
    PutUser : async (req: express.Request, res: express.Response)=>{
        const oldUser = await User.findOne({_id : req.params.userId});
        if(oldUser == null){
          res.json({"Error" : "Failed To Update The User", "MSG" : "User ID Is Not Found"});
          return;
        }
        const newUser = await User.updateOne({_id : req.params.userId}, req.body);
        res.json(newUser);
    },
    PatchUser : async (req: express.Request, res: express.Response)=>{
        const oldUser = await User.findOne({_id : req.params.userId});
        if(oldUser == null){
          res.json({"Error" : "Failed To Update The User", "MSG" : "User ID Is Not Found"});
          return;
        }
        const newUser = {
          ...oldUser.toObject(),
          ...req.body,
        }
        const r = await User.updateOne({_id : req.params.userId}, newUser);
        res.json(r).status(200);
    },
    GetUsers : async (req: express.Request, res: express.Response)=>{
        res.json(await User.find()).status(200);
    },
    GetUser : async (req: express.Request, res: express.Response)=>{
        res.json(await User.findOne({_id : req.params.userId})).status(200);
    },
    DeleteUser : async (req: express.Request, res: express.Response)=>{
        const deletedUser = await User.findOne({_id : req.params.userId});
        if(deletedUser == null){
            res.json({"Error" : "User Not Deleted", "Msg" : "Their Is No User With That ID ^_^"}).status(404);
        }
        const userPosts = await Post.find({CreatedBy : req.params.userId});
        userPosts.forEach((post : any) => {
            DeletePost(post, req, res);
        });
        res.json(await User.deleteOne({_id : req.params.userId})).status(200);
    }
};