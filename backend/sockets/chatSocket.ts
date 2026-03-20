import { Server, Socket } from "socket.io";
import Message from "../models/Messages";

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
      const { senderId, receiverId, messageContent } = data;

      try {
        const newMessage = new Message({
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
