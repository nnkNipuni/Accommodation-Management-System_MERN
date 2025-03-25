// import mongoose from "mongoose";

// const advertisementSchema = new mongoose.Schema({
//     Adtitle: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     description: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     facilities:{
//         type: [String],
//         required: true,
//         trim: true,
//     },

//     price: {
//         type: Number,
//         required: true,
//     },
//     image: {
//         type: [String],
//         required: true,
//     },
//     AccommodationType: {
//         type: String,
//         required: true,
//     },
//     date: {
//         type: Date,
//         default: Date.now,
//     },
// }, {
//     timestamps: true   //createdAt, updatedAt
// });

// const Advertisement = mongoose.model('Advertisement', advertisementSchema); //mongoose make this advertisements
// export default Advertisement;

import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema({
    Adtitle: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    facilities: { type: [String], required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Ensure this field exists
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
  });
const Advertisement = mongoose.model("Advertisement", advertisementSchema);
export default Advertisement;
