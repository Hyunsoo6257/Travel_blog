import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  userTitle: {
    type: String,
    default: "",
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  savedArticles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
