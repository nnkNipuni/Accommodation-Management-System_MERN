import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    adId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advertisement',
        required: false
    },
    boardingOwnerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'BoardingOwner',
        required: false
    },
    amount:{
        type: Number,
        required: true
    },
    paymentdate:{
        type:Date,
        required: true
    },
    proof:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    }

},{
    timestamps: true //createdAt, updatedAt (give the time that created the doc and when it updates that time as well) 
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;