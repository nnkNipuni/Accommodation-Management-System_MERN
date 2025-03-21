import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema({
    Adtitle: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    facilities:{
        type: String,
        required: true,
        trim: true,
    },

    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true   //createdAt, updatedAt
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema); //mongoose make this advertisements
export default Advertisement;