import { Document, Types } from "mongoose";

export type NotificationType = Document & {
  receiverId: Types.ObjectId;
  senderId: Types.ObjectId;
  chatId?: Types.ObjectId;
  messageId?: Types.ObjectId;
  type: "message" | "group_invite" | "group_remove" | "reaction";
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};
