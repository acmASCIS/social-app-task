import { Schema, model as Model } from 'mongoose';
import { hashSHA512 } from '../wcrypto';

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },

  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },

  created_at: {
    type: Date,
    required: false,
    default: Date.now,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const password = this.get('password');
  const hash = hashSHA512(password);

  this.set('password', hash);

  next();
});

const User = Model('User', userSchema);
export { User };
