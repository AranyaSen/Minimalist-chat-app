"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Messages_1 = __importDefault(require("@/models/Messages"));
const Conversations_1 = __importDefault(require("@/models/Conversations"));
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
            const { senderId, receiverId, messageContent, chatId } = data;
            try {
                let conversationId = chatId;
                // If no chatId, it's a direct message, find or create conversation
                if (!conversationId && receiverId) {
                    let conversation = await Conversations_1.default.findOne({
                        type: "direct",
                        $and: [
                            { participants: { $elemMatch: { userId: senderId } } },
                            { participants: { $elemMatch: { userId: receiverId } } },
                        ],
                    });
                    if (!conversation) {
                        conversation = await Conversations_1.default.create({
                            type: "direct",
                            participants: [
                                { userId: senderId, role: "member" },
                                { userId: receiverId, role: "member" },
                            ],
                        });
                    }
                    conversationId = conversation._id;
                }
                const newMessage = new Messages_1.default({
                    senderId: senderId,
                    receiverId: receiverId, // Keep for backward compatibility
                    chatId: conversationId,
                    content: messageContent,
                });
                await newMessage.save();
                // Update last message in conversation
                await Conversations_1.default.findByIdAndUpdate(conversationId, {
                    lastMessage: newMessage._id,
                });
                await newMessage.populate("senderId", "username");
                await newMessage.populate({
                    path: "chatId",
                    populate: {
                        path: "participants.userId",
                        select: "username email",
                    },
                });
                // Emit to all users in the conversation
                const conversation = await Conversations_1.default.findById(conversationId);
                if (conversation) {
                    conversation.participants.forEach((p) => {
                        const userSocket = onlineUsers.get(p.userId.toString());
                        if (userSocket) {
                            io.to(userSocket).emit("receive-message", newMessage);
                        }
                    });
                }
            }
            catch (err) {
                console.error("Send message error:", err);
            }
        });
        /* Message reaction */
        socket.on("message-reaction", async ({ messageId, reaction, }) => {
            try {
                const message = await Messages_1.default.findByIdAndUpdate(messageId, { messageReaction: reaction }, { new: true })
                    .populate("sender", "username")
                    .populate("receiver", "username");
                io.emit("reaction-updated", message);
            }
            catch (err) {
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
