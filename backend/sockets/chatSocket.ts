import { Server, Socket } from "socket.io";
import ReadMessage from "@/models/ReadMessage";

const onlineUsers = new Map<string, string>();

const initializeSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    /* Register user — join their personal room */
    socket.on("join-room", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
      console.log("User joined room:", userId);
    });

    /* Join a specific chat room (called when user opens a conversation) */
    socket.on("join-chat", (chatId: string) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat: ${chatId}`);
    });

    /* Mark messages as read */
    socket.on(
      "mark-read",
      async ({
        chatId,
        userId,
      }: {
        chatId: string;
        userId: string;
      }) => {
        try {
          // Update the lastReadMessageId for this participant in the conversation
          // and create ReadMessage entries for unread messages
          const { default: Message } = await import("@/models/Messages");
          const { default: Conversation } = await import(
            "@/models/Conversations"
          );

          // Get the latest message in this chat
          const latestMessage = await Message.findOne({ chatId })
            .sort({ createdAt: -1 })
            .select("_id");

          if (!latestMessage) return;

          // Upsert read receipt for the latest message
          await ReadMessage.findOneAndUpdate(
            { chatId, userId },
            {
              messageId: latestMessage._id,
              chatId,
              userId,
              readAt: new Date(),
            },
            { upsert: true, new: true }
          );

          // Update participant's lastReadMessageId in the conversation
          await Conversation.updateOne(
            { _id: chatId, "participants.user": userId },
            { $set: { "participants.$.lastReadMessageId": latestMessage._id } }
          );

          // Broadcast to chat room so other users see read status
          socket.to(chatId).emit("messages-read", {
            chatId,
            userId,
            messageId: latestMessage._id.toString(),
            readAt: new Date().toISOString(),
          });
        } catch (err) {
          console.error("Mark read error:", err);
        }
      }
    );

    /* Disconnect */
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
