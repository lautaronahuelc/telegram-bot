import mongoose from 'mongoose';

const dbConnect = async () => {
  const dbUri = process.env.NODE_ENV === 'production'
  ? process.env.MONGO_URI_PROD
  : process.env.MONGO_URI_DEV;

  try {
    await mongoose.connect(dbUri);
    console.log(`✅ MongoDB connected successfully on ${process.env.NODE_ENV}.`);
  } catch (error) {
    console.log('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default dbConnect;