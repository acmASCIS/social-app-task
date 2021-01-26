import express, { NextFunction } from "express";
import mongoose, { mongo } from "mongoose";
import Post from "../models/post";
import grid from "gridfs-stream";

const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

function postPost(req: express.Request, res: express.Response, next: NextFunction) {
  const imageUrl = req.protocol + '://' + req.get('host') + "/image/" + req.file.filename;
  console.log(req.file);
  const post = new Post({ text: req.body.text, image: { fileName: req.file.filename, url: imageUrl }, createdBy: req.body.createdBy });
  post.save().then(post => res.json(post)).catch(err => next(err));
}

function updatePost(req: express.Request, res: express.Response, next: NextFunction) {
  const updatedText = req.body.text;

  if (!updatedText) {
    const error = new Error("No text found to be updated.");
    error.status= 422;
    next(error);
  }

  Post.findOneAndUpdate({ _id: req.params.postId }, { text: updatedText })
    .then(stat => {
      res.statusCode = 202;
      res.send({ status: "Accepted" });
    }).catch(err => next(err));

}

function deletePost(req: express.Request, res: express.Response, next: NextFunction) {
  Post.findOne({ _id: req.params.postId }).then(post => {
    gfs.remove({ filename: post.image.fileName, root: 'uploads' }, (err, gridStore) => {
      if (err) return next(err);

    });


    Post.deleteOne(post)
      .then(post => res.send(post)).catch(err => next(err));
  });

}

function getPosts(req: express.Request, res: express.Response, next: NextFunction) {
  let idFilter = req.query.userId;
  if (idFilter)
    Post.find({ createdBy: req.query.userId }).populate("createdBy").sort({ updatedAt: -1 })
      .then(post => res.send(post)).catch(err => next(err));

  else
    Post.find().populate("createdBy").sort({ updatedAt: -1 })
      .then(posts => res.send(posts)).catch(err => next(err));

}

//image functions
function getPostImage(req: express.Request, res: express.Response, next: NextFunction) {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {

    if (!file || file.length === 0) {
      const error = new Error("No such a file.");
      error.status = 404;
      next(error);
    }


    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      const error = new Error("File is not an image.");
      error.status = 404;
      next(error);
    }
    
  });
}
export default { postPost, updatePost, deletePost, getPosts, getPostImage };