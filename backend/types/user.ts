import { Request } from "express";
import { Document } from "mongoose";

export type UserType = Document & {
  name: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  image?: {
    contentType: string;
    data: Buffer;
  };
};

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
  };
}

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
