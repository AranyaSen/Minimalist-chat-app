import { Document, Types } from "mongoose";
import { UserType } from "./user";
import { MessageType } from "./message";

export type ParticipantType = {
  user: Types.ObjectId;
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

export type ConversationPopulatedType = Omit<
  ConversationType,
  "participants" | "lastMessage"
> & {
  participants: (Omit<ParticipantType, "user"> & { user: UserType })[];
  lastMessage?: Omit<MessageType, "senderId"> & { senderId: UserType };
};
