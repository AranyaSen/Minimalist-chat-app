"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMessageReaction =
  exports.getConversationMessages =
  exports.getAllMessages =
    void 0;
const Messages_1 = __importDefault(require("../models/Messages"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
exports.getAllMessages = (0, asyncHandler_1.default)(async (req, res) => {
  const messages = await Messages_1.default.find();
  if (messages.length > 0) {
    return res.status(200).json(messages);
  }
  res.status(404);
  throw new Error("No messages found for all users");
});
exports.getConversationMessages = (0, asyncHandler_1.default)(
  async (req, res) => {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) {
      res.status(400);
      throw new Error("Invalid sender or receiver");
    }
    const messages = await Messages_1.default
      .find({
        $or: [
          { sender: receiverId, receiver: senderId },
          { sender: senderId, receiver: receiverId },
        ],
      })
      .populate("sender", "username")
      .populate("receiver", "username")
      .sort({ timeStamp: 1 });
    if (messages.length === 0) {
      res.status(404);
      throw new Error("No message");
    }
    res.status(200).json(messages);
  }
);
exports.updateMessageReaction = (0, asyncHandler_1.default)(
  async (req, res) => {
    const { reaction } = req.body;
    const messageId = req.params.messageId;
    if (!reaction) {
      res.status(400);
      throw new Error("reaction required");
    }
    const message = await Messages_1.default
      .findByIdAndUpdate(
        messageId,
        { messageReaction: reaction },
        { new: true }
      )
      .populate("sender", "username")
      .populate("receiver", "username");
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }
    const io = req.app.get("io");
    if (io) {
      io.emit("message-reaction", message);
    }
    res.status(200).json({ message: "reaction updated", content: message });
  }
);
