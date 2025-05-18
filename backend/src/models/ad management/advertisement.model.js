import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema({

  title: { type: String, required: true },
  description: 
  { type: String, 
    required: true 
  },
  price: { type: Number, required: true },
  facilities: { type: [String], required: true },
  images: { type: [String], required: true }, // Stores file paths
  AccommodationType: {
     type: String, 
     required: true 
    },
  approve: {
     type: String,
      default: "Pending" 
    },
    rejectionReason: { type: String, default: "" },
    location: { type: String, required: true },
    // latitude: parseFloat(latitude),
    // longitude: parseFloat(longitude),
    enabled: { type: Boolean, default: true },

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    paymentStatus: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" }
  },
  {timestamps: true}
);


const Advertisement = mongoose.model("Advertisement", advertisementSchema);
export default Advertisement;
 