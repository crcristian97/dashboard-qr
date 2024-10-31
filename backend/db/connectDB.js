// backend/connectdb.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Use an environment variable for the MongoDB URI instead of hardcoding credentials
    const mongoUri = process.env.MONGODB_URI;
    console.log("mongoUri", mongoUri);
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    console.log("Connecting to MongoDB at:", mongoUri);

    const conn = await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    if (conn.connection.readyState === 1) {
      console.log(`MongoDB connected successfully to: ${conn.connection.host}`);
      return true;
    } else {
      throw new Error('MongoDB connection not ready');
    }

  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}
