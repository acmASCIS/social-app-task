import mongoose from "mongoose";

const Schema = mongoose.Schema;
const postSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    image: {
        type: {}
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;