"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const Messages_1 = __importDefault(require("../models/Messages"));
const onlineUsers = new Map();
const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    /* Register user */
    socket.on("join-room", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("User joined:", userId);
    });
    /* Send message */
    socket.on("send-message", async (data) => {
      const { senderId, receiverId, messageContent } = data;
      try {
        const newMessage = new Messages_1.default({
          sender: senderId,
          receiver: receiverId,
          message: messageContent,
        });
        await newMessage.save();
        await newMessage.populate("sender", "username");
        await newMessage.populate("receiver", "username");
        const receiverSocket = onlineUsers.get(receiverId);
        if (receiverSocket) {
          io.to(receiverSocket).emit("receive-message", newMessage);
        }
        socket.emit("receive-message", newMessage);
      } catch (err) {
        console.error("Send message error:", err);
      }
    });
    /* Message reaction */
    socket.on("message-reaction", async ({ messageId, reaction }) => {
      try {
        const message = await Messages_1.default
          .findByIdAndUpdate(
            messageId,
            { messageReaction: reaction },
            { new: true }
          )
          .populate("sender", "username")
          .populate("receiver", "username");
        io.emit("reaction-updated", message);
      } catch (err) {
        console.error("Reaction error:", err);
      }
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });
};
exports.default = initializeSocket;
