const PostSchema = new mongoose.Schema({
    id : {
        type : Number,
        unique : true,
    },
    Body : {
        type : String,
    },
    Image : String,
    CreatedBy : {
        type : User,
        required : true,
    },
    CreatedAt : Date,
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;