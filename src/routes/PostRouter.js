const express=require('express');
const BodyParser=require('body-parser');
const mongoose=require('mongoose');
const Posts=require('../models/posts');
const Users=require('../models/user');
var multer  = require('multer');
const storage=multer.diskStorage({
  destination:function(req,file,cb){
  cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
      cb(null,file.originalname);
    }
  });
var upload = multer({ storage:storage });
const PostRouter= express.Router();
PostRouter.use(BodyParser.json());



PostRouter.route('/')
.get((req,res,next)=>{
  var url1=req.url;

  //when query string is not found return all posts
  if (url1.length<=1){
    Posts.find({}).sort({date: -1}).populate('author').then((posts)=>{   
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(posts);
        },(err)=>next(err)).catch((err)=>next(err));
      }

  else{
    //when query string is found return all posts of specific user
   var UserStringQuery=url1.split('=');
   var userID=UserStringQuery[1];
    if (UserStringQuery.length>2){
      res.statusCode=403;
      res.end('only one user is accepted');
    }
    else{

    Users.findOne({_id:userID},(err1,res1)=>{
    if (err1){
      res.statusCode=403;
      res.end('this user is not found '+userID);
     }
     else{
        Posts.find({}).find({author:userID}).sort({date: -1}).populate('author').then((posts)=>{   
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(posts);
        },(err)=>next(err)).catch((err)=>next(err));
     }
   });
    
  }  
}

})
.post(upload.single('image'),(req,res,next)=>{
  
  if (req.file!=null)
  req.body.image=req.file.path;
  Users.findOne({_id:req.body.author},(err1,res1)=>{
    if (err1){
      res.statusCode=403;
      res.end('this user is not found '+req.body.author);
     }
     else{
      Posts.create(req.body).then((post)=>{
        console.log('Post created', post);
      
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(post);
       
      },(err)=>next(err)).catch((err)=>next(err));
     }
   });

    
})
.put((req,res,next)=>{
   res.statusCode=403;
   res.end('put operation is not supported on /posts');
})
.patch((req,res,next)=>{
    res.statusCode=403;
    res.end('patch operation is not supported on /posts');
})
.delete((req,res,next)=>{
    res.statusCode=403;
    res.end('delete operation is not supported on /posts');
});



 PostRouter.route('/:postID')
 .get((req,res,next)=>{
  res.statusCode=403;
  res.end('get operation is not supported on /posts '+req.params.postID);
 })
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('post operation is not supported on /posts '+req.params.postID);
})
.put(upload.single('image'),(req,res,next)=>{
  if (req.file!=null){
    res.statusCode=403;
    res.end('you can not update images');
  }
  else
  {
    Posts.findByIdAndUpdate(req.params.postID,{
        $set : req.body
      },{new :true}).
      populate('author')
      .then((post)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(post);
    },(err)=>next(err)).catch((err)=>next(err));
  }

  
})
.patch((req,res,next)=>{
    res.statusCode=403;
    res.end('patch operation is not supported on /posts '+req.params.postID);
})
.delete((req,res,next)=>{
   Posts.findByIdAndRemove(req.params.postID).populate('author')
   .then((resp)=>{
    res.statusCode=200;
    res.setHeader('content-type','application/json');
    res.json(resp);
}
,(err)=>next(err)).catch((err)=>next(err));
});



module.exports=PostRouter;