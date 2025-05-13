import mongoose from "mongoose";

// Connect to MongoDB using the connection string from environment variables.
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`); // Confirm connection.
  } catch (error) {
    console.log("MongoDB connection error", error);
  }
};
