const mongoosee = require('mongoose');

const PostSchema = new mongoosee.Schema({
    Body : String,
    Image : String,
    CreatedBy : {
        type : String,
        required : true,
    },
    CreatedAt : Date,
});

const Post = mongoosee.model('Post', PostSchema);
module.exports = Post;