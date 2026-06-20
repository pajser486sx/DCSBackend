import mongoose from "mongoose";

const dailyWordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("DailyWord", dailyWordSchema);