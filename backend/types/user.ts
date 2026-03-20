import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  password: string;
  createdAt: Date;
  image?: {
    contentType: string;
    data: Buffer;
  };
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
  };
}
