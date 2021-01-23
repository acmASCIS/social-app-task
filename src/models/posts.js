var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    body:{
         type:String,
         default:'',
         required:true
    },
   image:{
        type:String,
        default:'',
   },
   author:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required:true

   }
   
},{ timestamps: true});



module.exports = mongoose.model('Post', postSchema);