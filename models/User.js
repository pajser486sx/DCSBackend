import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
username: {
  type: String,
  unique: true,
  sparse: true,
  trim: true,
  minlength: 2
},

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  isAdmin: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },

  registeredAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("User", userSchema);