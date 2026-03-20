import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "../types/user";

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  image: {
    contentType: String,
    data: Buffer,
  },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
