var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    body:{
         type:String,
         default:''
    },
   image:{
        type:String,
        default:'',
        required:true,
        unique:true

   },
   author:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'

   }
   
},{ timestamps: true});



module.exports = mongoose.model('Post', postSchema);