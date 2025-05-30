// import mongoose from 'mongoose';
// export const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI);
//         console.log(`MongoDB connected successfully: ${conn.connection.host}`);
//     } catch (err) {
//         console.error('Error: ${err.message}');
//         process.exit(1);  // 1 code means exit with failure, 0 means success
//     }
// };

import mongoose from 'mongoose';
export const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`✅ Connected to MongoDB: ${conn.connection.name}`);
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
      process.exit(1);
    }
  };
  