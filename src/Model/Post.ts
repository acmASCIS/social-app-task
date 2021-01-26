import mongoose from "mongoose";
import multer from "multer";

const postSchema = new mongoose.Schema({
    body: {
      type: String,
      required: true,
      default: "test post",
    },
    create_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image:{
        required:false,
        type: Object
    },
    created_at: {
      type: Date,
      required: false,
      default: Date.now,
    },
  });
  
  const Post = mongoose.model("Post", postSchema);
  export default Post;