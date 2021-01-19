const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id : {
        type : Number,
        unique : true,
    },
    Name : {
        type : String,
        required : true,
    },
    Email : {
        type : String,
        unique : true,
        required : true,
    },
    CreatedAt : Date,
});

const User = mongoose.model('User', UserSchema);
module.exports = User;