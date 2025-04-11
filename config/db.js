import mongoose from 'mongoose';
import { envConfig } from './env.js';

const dbConnect = async () => {
  try {
    await mongoose.connect(envConfig.MONGO_URI);
    console.log(`✅ MongoDB connected successfully on ${envConfig.NODE_ENV}.`);
  } catch (error) {
    console.log('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default dbConnect;