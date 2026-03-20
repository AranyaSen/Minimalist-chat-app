import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Message, SocketPayload, ReactionPayload } from "@/hooks/useChatSocket.types";

const URL = (import.meta.env.VITE_BACKEND_URL as string) || "";

export const socket = io(URL, {
  autoConnect: false,
});

export const useChatSocket = (userId: string) => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    function onConnect() {
      setIsConnected(true);
      console.log("✅ Connected to Socket.IO");
      socket.emit("register", userId);
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("❌ Disconnected from Socket.IO");
    }

    function onConnectError(err: Error) {
      console.error("⚠️ Connection Error:", err.message);
      setError(err.message);
    }

    function onPrivateMessage(msg: Message) {
      console.log("💬 New Message received:", msg);
      setMessages((prev) => {
        // Prevent duplicate messages
        const exists = prev.find((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
    }

    function onReactionUpdate({ messageId, reaction }: ReactionPayload) {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, messageReaction: reaction } : msg))
      );
    }

    // Connect manually
    socket.connect();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("private_message", onPrivateMessage);
    socket.on("reaction_update", onReactionUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("private_message", onPrivateMessage);
      socket.off("reaction_update", onReactionUpdate);
      socket.disconnect();
    };
  }, [userId]);

  const sendMessage = (payload: SocketPayload) => {
    if (socket.connected) {
      socket.emit("private_message", payload);
    } else {
      console.warn("Socket not connected. Cannot send message.");
    }
  };

  const sendReaction = (payload: ReactionPayload) => {
    if (socket.connected) {
      socket.emit("react_message", payload);
    }
  };

  return { isConnected, messages, error, sendMessage, sendReaction };
};
