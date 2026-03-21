import { Server, Socket } from "socket.io";
import Message from "@/models/Messages";
import Conversation from "@/models/Conversations";

const onlineUsers = new Map<string, string>();

const initializeSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    /* Register user */
    socket.on("join-room", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log("User joined:", userId);
    });

    /* Send message */
    socket.on("send-message", async (data: any) => {
      const { senderId, receiverId, messageContent, chatId } = data;

      try {
        let conversationId = chatId;

        // If no chatId, it's a direct message, find or create conversation
        if (!conversationId && receiverId) {
          let conversation = await Conversation.findOne({
            type: "direct",
            $and: [
              { participants: { $elemMatch: { userId: senderId } } },
              { participants: { $elemMatch: { userId: receiverId } } },
            ],
          });

          if (!conversation) {
            conversation = await Conversation.create({
              type: "direct",
              participants: [
                { userId: senderId, role: "member" },
                { userId: receiverId, role: "member" },
              ],
            });
          }
          conversationId = conversation._id;
        }

        const newMessage = new Message({
          senderId: senderId,
          receiverId: receiverId, // Keep for backward compatibility
          chatId: conversationId,
          content: messageContent,
        });

        await newMessage.save();

        // Update last message in conversation
        await Conversation.findByIdAndUpdate(conversationId, {
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
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          conversation.participants.forEach((p: any) => {
            const userSocket = onlineUsers.get(p.userId.toString());
            if (userSocket) {
              io.to(userSocket).emit("receive-message", newMessage);
            }
          });
        }
      } catch (err) {
        console.error("Send message error:", err);
      }
    });

    /* Message reaction */
    socket.on(
      "message-reaction",
      async ({
        messageId,
        reaction,
      }: {
        messageId: string;
        reaction: string;
      }) => {
        try {
          const message = await Message.findByIdAndUpdate(
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
      }
    );

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

export default initializeSocket;
