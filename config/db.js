import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully.');
  } catch (error) {
    console.log('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default dbConnect;