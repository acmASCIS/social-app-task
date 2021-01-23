import express from "express";
import bodyParser from "body-parser";
import asyncHandler from 'express-async-handler';
import multer from "multer";
import path from "path";
import Post from '../models/post';
import User from '../models/user';

const router = express.Router();
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

// midlewares
router.use('/public', express.static('public'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// post endpoints
router.post("/posts/:userID", upload.single('image'), asyncHandler(async (req: express.Request, res: express.Response) => {
    const userID = req.params.userID;
    const userName = (await User.findOne({ "_id": userID })).name;

    var post = req.body;
    post.created_by = userName;
    if (req.file != undefined) {
        post.image_URL = req.file.path;
    }

    post = await Post.create(post);
    res.json(post);
}));

router.put("/posts/:postID", upload.single('image'), asyncHandler(async (req: express.Request, res: express.Response) => {
    const oldPostID = req.params.postID;

    const newPost = req.body;
    if (req.file != undefined) {
        newPost.image_URL = req.file.path;
    }
    newPost.created_by = (await Post.findOne({ "_id": oldPostID })).created_by;

    const result = await Post.replaceOne({ "_id": oldPostID }, newPost);
    res.json(result);
}));

router.patch("/posts/:postID", upload.single('image'), asyncHandler(async (req: express.Request, res: express.Response) => {
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

router.get("/posts", asyncHandler(async (_req: express.Request, res: express.Response) => {
    const posts = await Post.find({});
    res.json(posts);
}));

router.get("/posts/:userID", asyncHandler(async (req: express.Request, res: express.Response) => {
    const userID = req.params.userID;
    const userName = (await User.findOne({ "_id": userID })).name;

    const posts = await Post.find({ "created_by": userName });
    res.json(posts);
}));

router.delete("/posts/:postID", asyncHandler(async (req: express.Request, res: express.Response) => {
    const postID = req.params.postID;

    const result = await Post.deleteOne({ "_id": postID });
    res.json(result);
}));

export default router;
