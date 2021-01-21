const user = require('./user');
const mongoosee = require('mongoose');

const PostSchema = new mongoosee.Schema({
    id : {
        type : Number,
        unique : true,
    },
    Body : {
        type : String,
    },
    Image : String,
    CreatedBy : {
        type : String,
        required : true,
    },
    CreatedAt : Date,
});

const Post = mongoosee.model('Post', PostSchema);
module.exports = Post;