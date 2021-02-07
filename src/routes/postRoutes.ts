import express from "express";
import post from "../controllers/postController";
import upload from "../imageStorage";

const router = express.Router();

router.post("/posts/:userID", upload.single('image'), post.createNewPost);
router.put("/posts/:postID", upload.single('image'), post.replacePost);
router.patch("/posts/:postID", upload.single('image'), post.updatePost);
router.get("/posts", post.getAllPosts);
router.get("/posts/:userID", post.getSpecificPost);
router.delete("/posts/:postID", post.deletePost);

export default router;
