import Payment from '../../models/finance/payment.model.js';
import path from 'path';
import fs from 'fs';

const validateAmount = (amount) => {
  const parsedAmount = parseFloat(amount);
  return !isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount.toFixed(0) === amount;
};

// Create Payment (Boarding Owner)
// export const createPayment = async (req, res) => {
//   try {
//       console.log('Request body:', req.body);
//       console.log('Request file:', req.file);
      
//       if (!req.file) {
//           return res.status(400).json({ 
//               success: false,
//               message: 'Proof (PDF) file is required' 
//           });
//       }

//       const { amount, paymentdate, userId, adId } = req.body;

//       // Validate required fields
//       if (!amount || !paymentdate || !adId) {
//           return res.status(400).json({ 
//               success: false, 
//               message: "Please fill all the details including advertisement ID" 
//           });
//       }

//       // Validate amount
//       const parsedAmount = parseFloat(amount);
//       if (isNaN(parsedAmount) || parsedAmount <= 0) {
//           return res.status(400).json({ 
//               success: false, 
//               message: 'Invalid amount' 
//           });
//       }

//       // Validate date
//       const date = new Date(paymentdate);
//       if (isNaN(date.getTime())) {
//           return res.status(400).json({ 
//               success: false, 
//               message: 'Invalid payment date' 
//           });
//       }

//       // Create payment object
//       const paymentData = {
//           adId: adId,  // Include the advertisement ID
//           boardingOwnerId: userId,
//           amount: parsedAmount,
//           paymentdate: date,
//           proof: `/uploads2/${req.file.filename}`,
//           status: 'Pending' 
//       };

//       console.log('Creating payment with:', paymentData);

//       // Save payment to database
//       const newPayment = new Payment(paymentData);
//       await newPayment.save();

//       console.log('Payment saved successfully:', newPayment);

//       res.status(201).json({ 
//           success: true,
//           message: 'Payment submitted successfully', 
//           payment: newPayment 
//       });
//   } catch (error) {
//       console.error("Detailed error in submitting the payment:", error);
      
//       // Handle specific MongoDB errors
//       if (error.name === 'ValidationError') {
//           return res.status(400).json({
//               success: false,
//               message: 'Validation Error',
//               error: error.message
//           });
//       }

//       // Handle duplicate key errors
//       if (error.code === 11000) {
//           return res.status(400).json({
//               success: false,
//               message: 'Duplicate payment detected',
//               error: error.message
//           });
//       }

//       // Handle CastError (invalid ObjectId)
//       if (error.name === 'CastError') {
//           return res.status(400).json({
//               success: false,
//               message: 'Invalid user ID format',
//               error: error.message
//           });
//       }

//       // Handle other errors
//       res.status(500).json({ 
//           success: false, 
//           message: "Server Error", 
//           error: error.message,
//           stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       });
//   }
// };

// Create Payment (Boarding Owner)
export const createPayment = async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: 'Proof (PDF) file is required' 
        });
      }
  
      const { amount, paymentdate, userId, adId } = req.body;
  
      // Validate required fields
      if (!amount || !paymentdate || !adId) {
        return res.status(400).json({ 
          success: false, 
          message: "Please fill all the details including advertisement ID" 
        });
      }
  
      // Validate amount
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid amount' 
        });
      }
  
      // Validate date
      const date = new Date(paymentdate);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid payment date' 
        });
      }
  
      // Create payment object
      const paymentData = {
        adId: adId,
        boardingOwnerId: userId,
        amount: parsedAmount,
        paymentdate: date,
        proof: `/uploads2/${req.file.filename}`,
        status: 'Pending' 
      };
  
      console.log('Creating payment with:', paymentData);
  
      // Save payment to database
      const newPayment = new Payment(paymentData);
      await newPayment.save();
  
      console.log('Payment saved successfully:', newPayment);
  
      // ✅ Link payment to advertisement
      await Advertisement.findByIdAndUpdate(adId, {
        paymentStatus: newPayment._id
      });
  
      res.status(201).json({ 
        success: true,
        message: 'Payment submitted successfully', 
        payment: newPayment 
      });
    } catch (error) {
      console.error("Detailed error in submitting the payment:", error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          error: error.message
        });
      }
  
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Duplicate payment detected',
          error: error.message
        });
      }
  
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID format',
          error: error.message
        });
      }
  
      res.status(500).json({ 
        success: false, 
        message: "Server Error", 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };
  


// Get User Payments
export const getUserPayments = async (req, res) => {
  const { userId } = req.params;
  const { amount, date, status } = req.query;

  try {
      // Build query object
      const query = { usersId: userId };

      // Add amount filter if provided
      if (amount) {
          query.amount = parseFloat(amount);
      }

      // Add date filter if provided
      if (date) {
          const searchDate = new Date(date);
          const startDate = new Date(searchDate.setHours(0, 0, 0, 0));
          const endDate = new Date(searchDate.setHours(23, 59, 59, 999));
          
          query.paymentdate = {
              $gte: startDate,
              $lte: endDate
          };
      }

      // Add status filter if provided
      if (status) {
          query.status = status;
      }

      const payments = await Payment.find(query)
          .populate('adId')
          .sort({ paymentdate: -1 }) // Sort by payment date, newest first
          .exec();

      res.status(200).json({ payments: payments || [] });
  } catch (error) {
      console.error('Error fetching user payments:', error);
      res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
  }
};

// Get All Payments (Admin)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('adId')
      .sort({ paymentdate: -1 })
      .exec();

    if (!payments.length) {
      return res.status(200).json({ payments: [] });
    }

    res.status(200).json({ payments });
  } catch (error) {
    console.error('Error fetching all payments:', error);
    res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
  }
};

// View Payment Details (Owner)
export const getPaymentDetails = async (req, res) => {
  const { boardingOwnerId } = req.params;

  try {
      const payments = await Payment.find({ boardingOwnerId })
          .populate('adId')
          .sort({ paymentdate: -1 })
          .exec();

      if (!payments.length) {
          return res.status(200).json({ payments: [] });
      }

      res.status(200).json({ payments });
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch payment details', error: error.message });
  }
};

// Update Payment Status (Admin)
// export const updatePaymentStatus = async (req, res) => {
//   const { paymentId } = req.params;
//   const { status } = req.body;

//   if (!['Pending', 'Verified', 'Rejected'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status value' });
//   }

//   try {
//       const updatedPayment = await Payment.findByIdAndUpdate(
//           paymentId,
//           { status },
//           { new: true }
//       );

//       if (!updatedPayment) {
//           return res.status(404).json({ message: 'Payment not found' });
//       }

//       res.status(200).json({ message: 'Payment status updated successfully', updatedPayment });
//   } catch (error) {
//       res.status(500).json({ message: 'Failed to update payment status', error: error.message });
//   }
// };

// Update Payment Status (Admin)
export const updatePaymentStatus = async (req, res) => {
    const { paymentId } = req.params;
    const { status } = req.body;
  
    if (!['Pending', 'Verified', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
  
    try {
      const updatedPayment = await Payment.findByIdAndUpdate(
        paymentId,
        { status },
        { new: true }
      );
  
      if (!updatedPayment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
  
      // ✅ If status is Verified, update related advertisement
      if (status === 'Verified' && updatedPayment.adId) {
        await Advertisement.findByIdAndUpdate(
          updatedPayment.adId,
          { paymentStatus: updatedPayment._id }
        );
      }
  
      res.status(200).json({ message: 'Payment status updated successfully', updatedPayment });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update payment status', error: error.message });
    }
  };
  


// Delete payment by admin
export const deletePayment = async (req, res) => {
  const { paymentId } = req.params;

  try {
  const deletePayment = await Payment.findByIdAndDelete(paymentId);

      if (!deletePayment) {
          return res.status(404).json({ message: 'Payment not found' });
  }

      // Remove the proof from the uploads
  const proofPath = path.join('uploads', path.basename(deletePayment.proof));

      if (fs.existsSync(proofPath)) {
    fs.unlinkSync(proofPath);
  }

      res.status(200).json({ message: 'Payment deleted successfully', deletePayment });
  } catch (error) {
      res.status(500).json({ message: 'Failed to delete the payment', error: error.message });
}
};

// Search Payments with Filters
export const searchPayments = async (req, res) => {
  const { date, adId, status } = req.query;
  const query = {};

  if (date) {
      const searchDate = new Date(date);
      const startDate = new Date(searchDate.setHours(0, 0, 0, 0));
      const endDate = new Date(searchDate.setHours(23, 59, 59, 999));
      
      query.paymentdate = {
          $gte: startDate,
          $lte: endDate
      };
  }

  if (adId) {
      query.adId = adId;
  }

  if (status) {
      query.status = status;
  }

  try {
      const payments = await Payment.find(query)
          .populate('adId')
          .sort({ paymentdate: -1 })
          .exec();

      res.status(200).json({ payments });
  } catch (error) {
      console.error('Error searching payments:', error);
      res.status(500).json({ message: 'Failed to search payments', error: error.message });
  }
};
