const mongoose=require("mongoose");
const schema=mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:String,
    email:String,
    //created_at:Date.now
    created_at:{type:Date,default:Date.now},
     userImage: { type: String, required: true }
});

module.exports=mongoose.model("app",schema);
