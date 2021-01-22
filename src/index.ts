import express, { NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import asyncHandler from 'express-async-handler';
require("dotenv").config();

const User = require('./user');
const Post = require('./post');

const app: express.Application = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGOURI || 'mongodb://localhost:27017/socialapp';


// image storage
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, './public/images')
  },
  filename: function (_req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

app.use('/public', express.static('public'));

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

async function main() {

  try {

    // connect to mongodb
    await mongoose.connect(
      mongoURI,
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

    // user endpoints
    app.post("/users", asyncHandler(async (req: express.Request, res: express.Response) => {
      const user = await User.create(req.body);
      res.json(user);
    }));

    app.put("/users/:userID", asyncHandler(async (req: express.Request, res: express.Response) => {
      const oldUserID = req.params.userID;
      const newUser = req.body;

      const result = await User.replaceOne({ "_id": oldUserID }, newUser);
      res.json(result);
    }));

    app.patch("/users/:userID", asyncHandler(async (req: express.Request, res: express.Response) => {
      const updates = req.body;
      const userID = req.params.userID;

      const user = await User.findOne({ "_id": userID });

      const updatedUser = {
        ...user.toObject(),
        ...updates
      }

      const result = await User.updateOne({ "_id": userID }, updatedUser);
      res.json(result);
    }));

    app.get("/users", asyncHandler(async (_req: express.Request, res: express.Response) => {
      const users = await User.find({});
      res.json(users);
    }));

    app.get("/users/:userID", asyncHandler(async (req: express.Request, res: express.Response) => {
      const userID = req.params.userID;

      const user = await User.findOne({ "_id": userID });
      res.json(user);
    }));

    app.delete("/users/:userID", asyncHandler(async (req: express.Request, res: express.Response) => {
      const userID = req.params.userID;

      const result = await User.deleteOne({ "_id": userID });
      res.json(result);
    }));


    // post endpoints
    app.post("/posts", upload.single('image'), asyncHandler(async (req: express.Request, res: express.Response) => {
      var post = req.body;
      if (req.file != undefined) {
        post.image_URL = req.file.path;
      }

      post = await Post.create(post);
      res.json(post);
    }));

    app.put("/posts/:postID", upload.single('image'), asyncHandler(async (req: express.Request, res: express.Response) => {
      const oldPostID = req.params.postID;

      const newPost = req.body;
      if (req.file != undefined) {
        newPost.image_URL = req.file.path;
      }
      newPost.created_by = (await Post.findOne({ "_id": oldPostID })).created_by;

      const result = await Post.replaceOne({ "_id": oldPostID }, newPost);
      res.json(result);
    }));

    app.patch("/posts/:postID", upload.single('image'), asyncHandler(async (req: express.Request, res: express.Response) => {
      const postID = req.params.postID;
      const post = await Post.findOne({ "_id": postID });

      var updates = req.body;
      if (req.file != undefined) {
        updates.image_URL = req.file.path;
      }

      const updatedPost = {
        ...post.toObject(),
        ...updates
      }

      const result = await Post.updateOne({ "_id": postID }, updatedPost);
      res.json(result);
    }));

    app.get("/posts", asyncHandler(async (_req: express.Request, res: express.Response) => {
      const posts = await Post.find({});
      res.json(posts);
    }));

    app.get("/posts/:userID", asyncHandler(async (req: express.Request, res: express.Response) => {
      const userID = req.params.userID;
      const userName = (await User.findOne({ "_id": userID })).name;

      const posts = await Post.find({ "created_by": userName });
      res.json(posts);
    }));

    app.delete("/posts/:postID", asyncHandler(async (req: express.Request, res: express.Response) => {
      const postID = req.params.postID;

      const result = await Post.deleteOne({ "_id": postID });
      res.json(result);
    }));

    app.use((req, res, next) => {
      res.status(404).json({
        status: 404,
        message: "Page not found!"
      });
    });

    app.use(((err, req, res, next) => {
      console.log('we are here');
      res.status(err.status).json({
        status: err.status,
        message: err.message
      });

    }) as express.ErrorRequestHandler);


    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });


  } catch (error) {
    console.log(`Error! ${error}`);
  }
}

main();
