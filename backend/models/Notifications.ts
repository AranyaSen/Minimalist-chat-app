import mongoose, { Schema, Model } from "mongoose";
import { NotificationType } from "@/types/notification";

const notificationSchema: Schema<NotificationType> = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    type: {
      type: String,
      enum: ["message", "group_invite", "group_remove", "reaction"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification: Model<NotificationType> = mongoose.model<NotificationType>(
  "Notification",
  notificationSchema
);

export default Notification;
