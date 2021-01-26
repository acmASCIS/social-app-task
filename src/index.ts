import express from "express";
import mongoose, { Connection } from "mongoose";
import bodyParser from "body-parser";
import multer from 'multer';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
require("dotenv").config();
const User = require("./dbSchema/user");
const Post = require("./dbSchema/post");

const app: express.Application = express();
const port = process.env.PORT;

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('./public'));
app.set('view engine', 'ejs');
///////////////////////////////////////////

const storage = multer.diskStorage({
  destination : './public/uploads/',
  filename : function(req: any, file: any, cb: any){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage : storage}).single('Image');

// DataBase Connection
const Connect = async () => {
  const URL : string = (process.env.MONGOURI || "");
  await mongoose.connect(
    URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    () => {
      console.log("connected to database");
    }
  );
};
Connect();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// test endpoints
////
app.get("/test", async (req: express.Request, res: express.Response) => {
  await User.deleteMany();
  await Post.deleteMany();
  res.json("DELETE THE DATABASE");
});
////
////
app.post("/test", async (req: express.Request, res: express.Response) => {

});
////
/////////////////////////////////////////////////////////////////////////////

// to connect to Localhost
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
////////////////////////////////////////////////////////////

//User Endpoints
////
app.post("/users", async (req: express.Request, res: express.Response)=>{
  const oldUser = await User.findOne({Email : req.body["Email"]});
  if(oldUser != null){
    res.json({"Error" : "Failed To Insert The User", "MSG" : "Thier Is A User With That Email"});
    return;
  }
  const newUser = new User(req.body);
  newUser["CreatedAt"] = new Date();
  await newUser.save();
  res.json(newUser).status(201);
});
////
////
app.put("/users/:userId", async (req: express.Request, res: express.Response)=>{
  const oldUser = await User.findOne({_id : req.params.userId});
  if(oldUser == null){
    res.json({"Error" : "Failed To Update The User", "MSG" : "User ID Is Not Found"});
    return;
  }
  const newUser = await User.updateOne({_id : req.params.userId}, req.body);
  res.json(newUser);
});
////
////
app.patch ("/users/:userId", async (req: express.Request, res: express.Response)=>{
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
});
////
////
app.get ("/users", async (req: express.Request, res: express.Response)=>{
  res.json(await User.find()).status(200);
});
////
////
app.get ("/users/:userId", async (req: express.Request, res: express.Response)=>{
  res.json(await User.findOne({_id : req.params.userId})).status(200);
});
////
////
app.delete ("/users/:userId", async (req: express.Request, res: express.Response)=>{
  const user = await User.findOne({_id : req.params.userId});
  if(user == null){
    res.json({"Error" : "Failed To Delete The User", "MSG" : "User ID Is Not Found"});
    return;
  }
  const userPosts = await Post.find({CreatedBy : user.toObject()["_id"]});
  userPosts.forEach(async (post: any) => {
    fs.unlink(post.toObject()["Image"],(err)=>{
      if(err)
        console.log(err);
    });
    await Post.deleteOne({_id : post.toObject()["_id"]});
  });
  res.json(await User.deleteOne({_id : req.params.userId}));
});
////////////////////////////////////////////////////////////////////////////////////////////
//Post Endpoints
////
app.post("/posts", async (req: express.Request, res: express.Response)=>{
  
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
  
});
////
////
app.put("/posts/:postId", async (req: express.Request, res: express.Response)=>{

  const post = await Post.findOne({_id : req.params.postId});
  if(post == null){
    res.json({"Error" : "Failed To Update The Post", "MSG" : "Post ID Is Not Found"});
    return;
  }
  post["Body"] = req.body["Body"];
  await post.save();
  res.json(post);
});
////
////
app.get ("/posts", async (req: express.Request, res: express.Response)=>{
  if(req.query.userId)
    res.json(await Post.find({CreatedBy : req.query.userId}).sort({CreatedAt : 1})).status(200);
  else
    res.json(await Post.find().sort({CreatedAt : 1})).status(200);
});
////
////
app.delete ("/posts/:postId", async (req: express.Request, res: express.Response)=>{
  const deletedPost = await Post.findOne({_id : req.params.postId});
  if(deletedPost == null){
    res.json({"Error" : "Failed To Delete The Post", "MSG" : "Post ID Is Not Found"});
    return;
  }
  fs.unlink(deletedPost.toObject()["Image"],(err)=>{
    if(err)
      console.log(err);
  });
  res.json(await Post.deleteOne({_id : req.params.postId}));
});
////
////////////////////////////////////////////////////////////////////////////////////////////