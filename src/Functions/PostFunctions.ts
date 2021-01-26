import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const User = require('../dbSchema/user');
const Post = require('../dbSchema/post');

const storage = multer.diskStorage({
    destination : './public/uploads/',
    filename : function(req: any, file: any, cb: any){
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage : storage}).single('Image');

async function DeletePost(deletedPost : any, req : express.Request, res : express.Response){
    fs.unlink(deletedPost.toObject()["Image"],(err)=>{
      if(err)
        console.log(err);
    });
    return await Post.deleteOne({_id : req.params.postId});
}

module.exports = {
    AddPost : async (req: express.Request, res: express.Response)=>{
        upload(req, res, async(err : any)=>{
          if(err)
            throw new Error("Can't Upload The Image");
          if(await User.findOne({_id : req.body["CreatedBy"]}) == null){
            res.json({"Error" : "Failed To Add The Post", "Msg" : "Their Is No User With That ID ^_^"});
            return;
          }
          req.body["CreatedAt"] = new Date();
          req.body["Image"] = req.file.path;
          const newPost = await new Post(req.body);
          await newPost.save();
          res.json(newPost).status(201);
        });
        
    },
    PutPost : async (req: express.Request, res: express.Response)=>{

        const post = await Post.findOne({_id : req.params.postId});
        if(post == null){
          res.json({"Error" : "Failed To Update The Post", "MSG" : "Post ID Is Not Found"});
          return;
        }
        post["Body"] = req.body["Body"];
        await post.save();
        res.json(post);
    },
    GetPosts : async (req: express.Request, res: express.Response)=>{
        if(req.query.userId)
          res.json(await Post.find({CreatedBy : req.query.userId})
            .sort({CreatedAt : 1})).status(200);
        else
          res.json(await Post.find().sort({CreatedAt : 1})).status(200);
    },
    DeletePost : async (req: express.Request, res: express.Response)=>{
        const deletedPost = await Post.findOne({_id : req.params.postId});
        if(deletedPost == null){
          res.json({"Error" : "Failed To Delete The Post", "MSG" : "Post ID Is Not Found"});
          return;
        }
        res.json(DeletePost(deletedPost, req, res));
    }
}