import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  facilities: { type: [String], required: true },
  images: { type: [String], required: true }, // Stores file paths
  AccommodationType: { type: String, required: true },
  approve: { type: String, default: "Pending" },
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);
export default Advertisement;
