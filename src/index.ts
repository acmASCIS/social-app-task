import express from "express";
import mongoose, { Connection } from "mongoose";
import bodyParser from "body-parser";
require("dotenv").config();
const User = require("./user");
const Post = require("./post");

const app: express.Application = express();
const port = process.env.PORT;

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
///////////////////////////////////////////

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
app.get("/test", async (req: express.Request, res: express.Response) => {
  await User.deleteMany();
  await Post.deleteMany();
  res.json("DELETE THE DATABASE");
});

app.post("/test", async (req: express.Request, res: express.Response) => {
  console.log(req.body);
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});
/////////////////////////////////////////////////////////////////////////////

// to connect to Localhost
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
////////////////////////////////////////////////////////////

//User Endpoints
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

app.put("/users/:userId", async (req: express.Request, res: express.Response)=>{
  const oldUser = await User.findOne({_id : req.params.userId});
  if(oldUser == null){
    res.json({"Error" : "Failed To Update The User", "MSG" : "User ID Is Not Found"});
    return;
  }
  const newUser = await User.updateOne({_id : req.params.userId}, req.body);
  res.json(newUser);
});

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

app.get ("/users", async (req: express.Request, res: express.Response)=>{
  res.json(await User.find()).status(200);
});

app.get ("/users/:userId", async (req: express.Request, res: express.Response)=>{
  res.json(await User.findOne({_id : req.params.userId})).status(200);
});

app.delete ("/users/:userId", async (req: express.Request, res: express.Response)=>{
  const user = await User.findOne({_id : req.params.userId});
  if(user == null){
    res.json({"Error" : "Failed To Delete The User", "MSG" : "User ID Is Not Found"});
    return;
  }
  res.json(await User.deleteOne({_id : req.params.userId}));
});
////////////////////////////////////////////////////////////////////////////////////////////
//Post Endpoints
app.post("/posts", async (req: express.Request, res: express.Response)=>{

  if((await User.findOne({_id : req.body["CreatedBy"]})) == null){
    res.json({"Error" : "Failed To Update The Post", "MSG" : "User ID Is Not Found"});
    return;
  }

  const newPost = await new Post(req.body);
  newPost["CreatedAt"] = new Date();
  await newPost.save();
  res.json(newPost).status(201);
});

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

app.get ("/posts", async (req: express.Request, res: express.Response)=>{
  res.json(await Post.find().sort({CreatedAt : 1})).status(200);
});

app.get ("/posts/:userId", async (req: express.Request, res: express.Response)=>{
  res.json(await Post.find({CreatedBy : req.params.userId}).sort({CreatedAt : 1})).status(200);
});

app.delete ("/posts/:postId", async (req: express.Request, res: express.Response)=>{
  const user = await Post.findOne({_id : req.params.postId});
  if(user == null){
    res.json({"Error" : "Failed To Delete The Post", "MSG" : "Post ID Is Not Found"});
    return;
  }
  res.json(await Post.deleteOne({_id : req.params.postId}));
});
////////////////////////////////////////////////////////////////////////////////////////////