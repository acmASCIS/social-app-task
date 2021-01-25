import mongoose from 'mongoose';
import validator from 'validator';
import Post from './post';

export interface IUser extends mongoose.Document {
    name : string;
    email: string;
}


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        validate(value: string){
            if(value === null){
                throw new Error('Please provide a value');
            }
        }
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value : string){
            if(!validator.isEmail(value) || value === null){
                throw new Error('Please provide an correct email');
            }
        }
    },
},
{
    timestamps:{
        createdAt:'created_at',
        updatedAt: false
    }
}
);

userSchema.virtual('posts',{
    ref: 'Post',
    localField: '_id',
    foreignField: 'user'
});

userSchema.pre('remove', async function(next) {
    const user = this
    await Post.deleteMany({ user: user._id });
    next()
});

const User = mongoose.model<IUser>('User',userSchema);

export default User;


