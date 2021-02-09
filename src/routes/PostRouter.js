import express from "express";
import BodyParser from "body-parser";
import Posts from "../models/posts";
import Users from "../models/user";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const PostRouter = express.Router();
PostRouter.use(BodyParser.json());

PostRouter.route("/")
  .get((req, res, next) => {
    //when query string is not found return all posts
    if (!req.query.user) {
      Posts.find({})
        .sort({ date: -1 })
        .populate("author")
        .then(
          (posts) => {
            res.json(posts);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
      return;
    }
    //when query string is found return all posts of specific user

    if (typeof req.query.user != "string") {
      res.statusCode = 400;
      res.end("only one user is accepted");
      return;
    }
    Users.findOne({ _id: req.query.user }, (err1, res1) => {
      if (err1) {
        res.statusCode = 403;
        res.end("this user is not found " + req.query.user);
        return;
      }
      Posts.find({})
        .find({ author: req.query.user })
        .sort({ date: -1 })
        .populate("author")
        .then(
          (posts) => {
            res.json(posts);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    });
  })
  .post(upload.single("image"), (req, res, next) => {
    if (req.file != null) req.body.image = req.file.path;
    Users.findOne({ _id: req.body.author }, (err1, res1) => {
      if (err1) {
        res.statusCode = 403;
        res.end("this user is not found " + req.body.author);
        return;
      }
      Posts.create(req.body)
        .then(
          (post) => {
            console.log("Post created", post);
            res.json(post);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    });
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("put operation is not supported on /posts");
  })
  .patch((req, res, next) => {
    res.statusCode = 403;
    res.end("patch operation is not supported on /posts");
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.end("delete operation is not supported on /posts");
  });

PostRouter.route("/:postID")
  .get((req, res, next) => {
    res.statusCode = 403;
    res.end("get operation is not supported on /posts " + req.params.postID);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("post operation is not supported on /posts " + req.params.postID);
  })
  .put(upload.single("image"), (req, res, next) => {
    if (req.file != null) {
      res.statusCode = 403;
      res.end("you can not update images");
      return;
    }
    Posts.findByIdAndUpdate(
      req.params.postID,
      {
        $set: req.body,
      },
      { new: true }
    )
      .populate("author")
      .then(
        (post) => {
          res.json(post);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .patch((req, res, next) => {
    res.statusCode = 403;
    res.end("patch operation is not supported on /posts " + req.params.postID);
  })
  .delete((req, res, next) => {
    Posts.findByIdAndRemove(req.params.postID)
      .populate("author")
      .then(
        (resp) => {
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

export default PostRouter;
