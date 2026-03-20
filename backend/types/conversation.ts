import { Document, Types } from "mongoose";

export type ParticipantType = {
  userId: Types.ObjectId;
  role: "member" | "admin";
  joinedAt: Date;
  lastReadMessageId?: Types.ObjectId;
};

export type ConversationType = Document & {
  type: "direct" | "group";
  participants: ParticipantType[];
  lastMessage?: Types.ObjectId;
  name?: string; // for group
  avatar?: string; // group icon
  createdAt: Date;
  updatedAt: Date;
};
