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
  await mongoose.connect(
    process.env.MONGOURI ||
      "mongodb+srv://SocialMediaApp:SocialMediaApp148@socialmediacluster.8tztr.mongodb.net/SocialMediaApp?retryWrites=true&w=majority",
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
  res.json(await User.find());
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
  const body = req.body;
  const newUser = User(body);
  await newUser.save();
  res.json(newUser).status(201);
});

app.put("/users/:userId", async (req: express.Request, res: express.Response)=>{
  const newUser = await User.updateOne({Id : req.params.userId}, req.body);
  res.json(newUser);
});

app.patch ("/users/:userId", async (req: express.Request, res: express.Response)=>{
  const oldUser = await User.findOne({Id : req.params.userId});
  const newUser = {
    ...oldUser.toObject(),
    ...req.body,
  }
  const r = await User.updateOne({Id : req.params.userId}, newUser);
  res.json(r).status(200);
});

app.get ("/users", async (req: express.Request, res: express.Response)=>{
  res.json(await User.find()).status(200);
});

app.get ("/users/:userId", async (req: express.Request, res: express.Response)=>{
  res.json(await User.findOne({Id : req.params.userId})).status(200);
});

app.delete ("/users/:userId", async (req: express.Request, res: express.Response)=>{
  res.json(await User.deleteOne({Id : req.params.userId}));
});
////////////////////////////////////////////////////////////////////////////////////////////
//Post Endpoints

////////////////////////////////////////////////////////////////////////////////////////////