import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    unique:true,
    min: 6,
    max: 255,
  },
  created_at: {
    type: Date,
    required: false,
    default: Date.now,
  },
});



const User = mongoose.model("User", userSchema);
export default User;