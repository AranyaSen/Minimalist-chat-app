import { Request } from "express";
import { Document } from "mongoose";

export type UserType = Document & {
  fullName: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  image?: {
    contentType: string;
    data: Buffer;
  };
  refreshToken?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
      };
    }
  }
}
