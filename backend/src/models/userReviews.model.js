import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewDescription: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  advertisement: { type: mongoose.Schema.Types.ObjectId, ref: "Advertisement", required: true }, // Make sure this references Advertisement
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;

