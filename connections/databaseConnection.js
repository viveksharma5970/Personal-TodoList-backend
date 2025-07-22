import mongoose from "mongoose";

export const databaseConnection = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};
