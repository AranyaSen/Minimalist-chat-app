import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mycluster.fgzmg.mongodb.net/${process.env.MONGO_DB_NAME}`;

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (err: any) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
