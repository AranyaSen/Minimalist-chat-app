import mongoose, { Schema, Model } from "mongoose";
import { ConversationType } from "@/types/conversation";

const conversationSchema: Schema<ConversationType> = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },

    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["member", "admin"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        lastReadMessageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",
        },
      },
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    name: String, // for group
    avatar: String, // group icon
  },
  { timestamps: true }
);

const Conversation: Model<ConversationType> = mongoose.model<ConversationType>(
  "Conversation",
  conversationSchema
);

export default Conversation;
