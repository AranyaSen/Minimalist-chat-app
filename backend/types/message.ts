import { Document, Types } from "mongoose";
import { UserType } from "./user";
import { ConversationPopulatedType } from "./conversation";

export type MessageType = Document & {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  chatId: Types.ObjectId;
  content: string;
  messageType: string;
  replyTo: Types.ObjectId;
  editedAt: Date;
  isDeleted: boolean;
  deletedAt: Date;
  messageReaction: {
    userId: Types.ObjectId;
    type: string;
  }[];
};

export type MessagePopulatedType = Omit<MessageType, "senderId" | "chatId"> & {
  senderId: UserType;
  chatId: ConversationPopulatedType;
};
