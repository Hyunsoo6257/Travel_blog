import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["adventure", "culture", "food-cafe"],
  },
  image: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    name: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    placeId: String, // Google Places API ID
  },
  savedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Article", articleSchema);
