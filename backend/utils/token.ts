import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export type Token = {
  username: string;
  userId: Types.ObjectId;
};

export const generateAccessToken = ({ userId, username }: Token) => {
  return jwt.sign({ username, userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = ({ userId, username }: Token) => {
  return jwt.sign({ username, userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};
