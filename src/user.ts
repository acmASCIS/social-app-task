import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String
  },
  { timestamps: true });
  
  const User = mongoose.model('users', userSchema);
  module.exports = User;
  