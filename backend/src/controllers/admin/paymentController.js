// import Payment from '../../models/payment.model.js';
// import path from 'path';
// import fs from 'fs';

// //Create Payment (Boarding Owner)
// export const createPayment = async (req, res) => {
//     const { amount, paymentdate } = req.body;
//     const advertisementId = req.body.advertisementId; // Auto-filled in form
//     const boardingOwnerId = req.body.boardingOwnerId; // Auto-filled in form

//     if (!req.file) {
//         return res.status(400).json({ message: 'Proof (PDF) file is required' });
//     }
//     if(!amount || !paymentdate){
//         return res.status(400).json({success:false, message: "Please fill all the details"});
//     }

//     const date = new Date(paymentdate);
//     if (isNaN(date)) {
//         return res.status(400).json({ success: false, message: 'Invalid payment date' });
//     }

//     const proofPath = ⁠ /uploads/${req.file.filename} ⁠;

//     try {
//         const newPayment = new Payment({
//             advertisementId,
//             boardingOwnerId,
//             amount,
//             paymentdate,
//             proof: proofPath,
//             status: 'Pending' 
//         });

//         await newPayment.save();
//         res.status(201).json({ message: 'Payment submitted successfully', payment: newPayment });
//     } catch (error) {
//         console.error("Error in submitting the payment:", error.message);
//         res.status(500).json({ success:false, message: "Server Error"});
//     }
// };




// // View Payment Details (Owner)

// export const getPaymentDetails = async (req, res) => {
//     const { boardingOwnerId } = req.params; // Assuming ID comes from URL params

//     try {
//         const payments = await Payment.find({ boardingOwnerId })
//             .populate('adId')
//             .exec();

//         if (!payments.length) {
//             return res.status(404).json({ message: 'No payments found' });
//         }

//         res.status(200).json({ payments });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch payment details', error: error.message });
//     }
// };


// // Update Payment Status (Admin)

// export const updatePaymentStatus = async (req, res) => {
//     const { paymentId } = req.params;
//     const { status } = req.body; // Expect 'Pending', 'Verified', or 'Rejected'

//     if (!['Pending', 'Verified', 'Rejected'].includes(status)) {
//         return res.status(400).json({ message: 'Invalid status value' });
//     }

//     try {
//         const updatedPayment = await Payment.findByIdAndUpdate(
//             paymentId,
//             { status },
//             { new: true }
//         );

//         if (!updatedPayment) {
//             return res.status(404).json({ message: 'Payment not found' });
//         }

//         res.status(200).json({ message: 'Payment status updated successfully', updatedPayment });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to update payment status', error: error.message });
//     }
// };

// //delete payment by admin
// export const deletePayment = async (req, res) =>{
//   const {paymentId} = req.params;
  
//   try{
//     const deletePayment = await Payment.findByIdAndDelete(paymentId);

//     if(!deletePayment){
//       return res.status(404).json({ message: 'Payment not found'});
//     }

//     //remove the proof from the uploads
//     const proofPath = path.join('uploads', path.basename(deletePayment.proof));

//     if(fs.existsSync(proofPath)){
//       fs.unlinkSync(proofPath);
//     }

//     res.status(200).json({ message: 'Payment deleted successfully', deletePayment});
//   }catch (error){
//     res.status(500).json({ message: 'Faild to delete the payment', error: error.message});
//   }
// };