import { Document, Types } from "mongoose";

export type ReadMessageType = Document & {
  messageId: Types.ObjectId;
  userId: Types.ObjectId;
  chatId: Types.ObjectId;
  readAt: Date;
};
