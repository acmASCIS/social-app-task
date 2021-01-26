import express from "express";
import mongoose from "mongoose";
import multer from "multer"
import gridFsStorage from "multer-gridfs-storage";
import grid from "gridfs-stream";
import crypto from "crypto";
import path from "path";
import PostsController from "../controllers/posts_controller";

const conn = mongoose.connection;
const router = express.Router();
let gfs;

conn.once('open', () => {
  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

function fileFilter(req, file, cb) {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") cb(null, true);
  else cb(null, false);
}

const storage = new gridFsStorage({
  url: process.env.MONGOURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage: storage, fileFilter: fileFilter });


router.post("/", upload.single("image"), PostsController.postPost);

router.put("/:postId", PostsController.updatePost)

router.delete("/:postId", PostsController.deletePost);

router.get("/", PostsController.getPosts);

export default router;
