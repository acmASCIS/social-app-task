import express from "express";
import mongoose, { Connection } from "mongoose";
import bodyParser from "body-parser";
import ejs from 'ejs';

require("dotenv").config();
const User = require("./dbSchema/user");
const Post = require("./dbSchema/post");
const UserFunctions = require('./Functions/UserFunctions');
const PostFunctions = require('./Functions/PostFunctions');

const app: express.Application = express();
const port = process.env.PORT;

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
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
////////////////////////////////////////////////////////////////////////////

// test endpoints
////
app.get("/test", async (req: express.Request, res: express.Response) => {
  await User.deleteMany();
  await Post.deleteMany();
  res.json("DELETE THE DATABASE");
});
app.post("/test", async (req: express.Request, res: express.Response) => {

});
////////////////////////////////////////////////////////////
// to connect to Localhost
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
////////////////////////////////////////////////////////////

//User Endpoints
////
app.post("/users", UserFunctions.AddUser);
app.put("/users/:userId", UserFunctions.PutUser);
app.patch ("/users/:userId", UserFunctions.PatchUser);
app.get ("/users", UserFunctions.GetUsers);
app.get ("/users/:userId", UserFunctions.GetUser);
app.delete ("/users/:userId", UserFunctions.DeleteUser);
/////////////////////////////////////////////////////////////

//Post Endpoints
////
app.post("/posts", PostFunctions.AddPost);
app.put("/posts/:postId", PostFunctions.PutPost);
app.get ("/posts", PostFunctions.GetPosts);
app.delete ("/posts/:postId", PostFunctions.DeletePost);
/////////////////////////////////////////////////////////////

//Invalid Endpoints
app.use((req : express.Request, res : express.Response) => {
  res.json({
    error: {
      'name':'Error',
      'status':404,
      'message':'Invalid Request',
      'statusCode':404
    },
    message: 'Testing!'
  });
});
////////////////////////////////////////