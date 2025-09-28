import mongoose from "mongoose";

let isConnected = false;
export const connectToOrderDB = async () => {
  if (isConnected) return;

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL environment variable is not set.");
  }

  try {
    const mongoUrl = process.env.MONGO_URL as string;

    await mongoose.connect(mongoUrl);

    isConnected = true;
    console.log("Connected to the Order database successfully.");
  } catch (error) {
    console.log("Error connecting to the Order database:", error);
    throw error;
  }
};
