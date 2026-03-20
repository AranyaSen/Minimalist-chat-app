import mongoose, { Schema, Model } from "mongoose";
import { UserType } from "@/types/user";

const userSchema: Schema<UserType> = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  image: {
    contentType: String,
    data: Buffer,
  },
});

const User: Model<UserType> = mongoose.model<UserType>("User", userSchema);
export default User;
