import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: String,
    image_URL: String
},
    { timestamps: true });

const Post = mongoose.model('posts', postSchema);
export default Post;
