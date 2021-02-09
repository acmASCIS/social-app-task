import express from "express";
import BodyParser from "body-parser";
import Posts from "../models/posts";
import Users from "../models/user";
const UserRouter = express.Router();
UserRouter.use(BodyParser.json());

UserRouter.route("/")
  .get((req, res, next) => {
    Users.find({})
      .then(
        (users) => {
          res.json(users);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Users.create(req.body)
      .then(
        (user) => {
          console.log("User created", user);
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("put operation is not supported on /users");
  })
  .patch((req, res, next) => {
    res.statusCode = 403;
    res.end("patch operation is not supported on /users");
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.end("delete operation is not supported on /users");
  });

UserRouter.route("/:userID")
  .get((req, res, next) => {
    Users.findById(req.params.userID)
      .then(
        (user) => {
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("post operation is not supported on /users " + req.params.userID);
  })
  .put((req, res, next) => {
    Users.findByIdAndUpdate(
      req.params.userID,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (user) => {
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .patch((req, res, next) => {
    Users.findByIdAndUpdate(
      req.params.userID,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (user) => {
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Users.findByIdAndRemove(req.params.userID)
      .then(
        (resp) => {
          // delete every post that user own
          Posts.deleteMany({ author: req.params.userID }, (err) =>
            next(err)
          ).catch((err) => next(err));
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

export default UserRouter;
