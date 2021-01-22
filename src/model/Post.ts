import { Schema, model as Model } from 'mongoose';

const postSchema = new Schema({
  id: {
    type: String,
    required: false,
  },

  text: {
    type: String,
    required: false,
    default: '',
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  created_at: {
    type: Date,
    required: false,
    default: Date.now,
  },
  likes: {
    counts: {
      type: Number,
    },
    users: {
      type: Array.of(Schema.Types.ObjectId),
    },

    require: false,
    default: { counts: 0, users: [] },
  },

  image:{
    type: String,
    required: false,
    default: null
  }
});

const Post = Model('Post', postSchema);
export { Post };
