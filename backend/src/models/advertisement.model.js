import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    facilities: { type: [String], required: true },
    images: { type: [String], required: true },
    AccommodationType: { type: String, required: true }
  });

const Advertisement = mongoose.model("Advertisement", advertisementSchema);
export default Advertisement;
