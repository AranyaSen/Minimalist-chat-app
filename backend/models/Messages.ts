import mongoose, { Schema, Model } from "mongoose";
import { MessageType } from "@/types/message";

const messageSchema: Schema<MessageType> = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "video", "file"],
      default: "text",
    },
    content: { type: String, required: true },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    editedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: Date,
    messageReaction: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        type: String,
        default: "",
      },
    ],
  },
  { timestamps: true }
);

const Message: Model<MessageType> = mongoose.model<MessageType>(
  "Message",
  messageSchema
);
export default Message;
