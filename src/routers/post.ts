import express from 'express';
import Post, { IPost } from '../models/post';
import multer from 'multer';
import sharp from 'sharp';
import  mongoose  from 'mongoose';
import User, { IUser } from '../models/user';

const router : express.Router = express.Router();

const upload = multer({
    limits:{
        fileSize: 7000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.toLowerCase().match(/\.(jpg|png|gif|jpeg)$/)){
            return cb(new Error('please provide an image that is less than 7MB'))
        }

        cb(null, true)
    }
});

router.post('/posts',upload.single('upload'), async (req: express.Request, res: express.Response) => {
   try{
    const buffer = await sharp(req.file.buffer).png().toBuffer();
    const  post: IPost = new Post({
     body: req.body.body,
     image: buffer,
     user: (new mongoose.Types.ObjectId(req.body.userId) || new mongoose.Types.ObjectId(req.user._id)) 
    });
    await post.save();
    res.status(201).send(post);
   } catch (e) {
       res.status(400).send({message: e.message});
   }
},(error: Error,req: express.Request,res: express.Response,next: express.NextFunction) => {
    res.status(400).send({"error.message":error.message});
});

router.put('/posts/:postId', async (req: express.Request, res: express.Response) => {
    try {
        const postID = req.params.postId;
        const post = await Post.findById(postID);
        if(!post){
            return res.status(404).send({error:'PostID is not correct'});
        }
        const validUpdate = 'body';
        const updates = Object.keys(req.body);
        if(updates.length !== 1 || updates[0] !== validUpdate){
            return res.status(400).send({error:'Please provide valid updates'});
        }

        post[validUpdate] = req.body[validUpdate];

        await post.save();
        res.send(post);
    }catch(e){
        res.status(400).send({message: e.message});
    }
});

router.delete('/posts/:postId', async (req: express.Request, res: express.Response) => {
    try{
        const postID = req.params.postId;
        const post: IPost = await Post.findByIdAndDelete(postID);
        if(!post){
            return res.status(404).send({error:'PostID is not correct'});
        }
        res.send(post);
    } catch(e){
        res.status(500).send({message: e.message});
    }

});

router.get('/posts', async (req: express.Request, res: express.Response) => {
    try {
        if(req.query.userId){
            const userID = req.query.userId;
            const user = await User.findById(userID);
            
            if(!user){
                return res.status(400).send({error:'UserID is not correct'});
            }

            await user.populate({
                path: 'posts',
                options: {
                    limit: parseInt(req.query.limit as string),
                    skip: parseInt(req.query.skip as string),
                    sort:{
                        'created_at': -1
                    },
                }
            }).execPopulate();
            const posts = user.posts;
            res.send(posts);
        }
        else{
            const posts = await Post.find({}).sort('-created_at');
            res.send(posts);
        }
    } catch(e){
        res.status(500).send({message: e.message});
    } 
});


export default router;