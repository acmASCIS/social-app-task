import mongoose from 'mongoose';

export interface IPost extends mongoose.Document {
    body: string;
    image: Buffer;
    user: mongoose.Types.ObjectId;
}

const postSchema = new mongoose.Schema({
    body: {
        type: String,
        trim: true,
        //required: true,
        default:'',
        validate(value: string){
            if(value === null){
                throw new Error('Please provide a body for the post!');
            }
        }
    },
    image: {
        type: Buffer,
        required: true,
        validate(value: Buffer){
            if(value === null){
                throw new Error('Please provide an image!');
            }
        }
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        validate(value: mongoose.Types.ObjectId){
            if(value === null){
                throw new Error('Please provide the id of the user who created the post!');
            }
        }
    }

},
{
    timestamps:{
        createdAt: 'created_at',
        updatedAt: false
    }
});

postSchema.methods.toJSON =  function(){
    const post = this
    const toSendObj = post.toObject();
    delete toSendObj.image;
    return toSendObj;
}

const Post = mongoose.model<IPost>('Post',postSchema);

export default Post;