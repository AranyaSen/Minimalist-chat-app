import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const generateAccessToken = (
  userId: Types.ObjectId,
  username: string
) => {
  return jwt.sign({ username, userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (
  userId: Types.ObjectId,
  username: string
) => {
  return jwt.sign({ username, userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};
