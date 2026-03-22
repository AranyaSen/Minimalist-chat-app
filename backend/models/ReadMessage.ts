import mongoose, { Schema, Model } from "mongoose";
import { ReadMessageType } from "@/types/readMessage";

const readMessageSchema: Schema<ReadMessageType> = new mongoose.Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  readAt: {
    type: Date,
    default: Date.now,
  },
});

const ReadMessage: Model<ReadMessageType> = mongoose.model<ReadMessageType>(
  "ReadMessage",
  readMessageSchema
);

export default ReadMessage;
