import mongoose, { Schema, Model } from "mongoose";
import { IMessage } from "../types/message";

const messageSchema: Schema<IMessage> = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String, required: true },
  messageReaction: { type: String, default: "" },
  timeStamp: { type: Date, default: Date.now },
});

const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  messageSchema
);
export default Message;
