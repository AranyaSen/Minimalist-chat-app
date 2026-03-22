import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

const URL = (import.meta.env.VITE_BACKEND_URL as string) || "";

let globalSocketInstance: Socket | null = null;

const getSocket = (): Socket => {
  if (!globalSocketInstance) {
    globalSocketInstance = io(URL, { autoConnect: false });
  }
  return globalSocketInstance;
};

export const useChatSocket = (userId: string) => {
  const socketRef = useRef<Socket>(getSocket());

  useEffect(() => {
    if (!userId) return;

    const s = socketRef.current;

    if (!s.connected) {
      s.connect();
    }

    function onConnect() {
      console.log("✅ Connected to Socket.IO");
      s.emit("join-room", userId);
    }

    function onDisconnect() {
      console.log("❌ Disconnected from Socket.IO");
    }

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);

    // If already connected, emit join-room immediately
    if (s.connected) {
      s.emit("join-room", userId);
    }

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.disconnect();
    };
  }, [userId]);

  const joinChat = (chatId: string) => {
    const s = socketRef.current;
    if (s.connected) {
      s.emit("join-chat", chatId);
    }
  };

  const markAsRead = (chatId: string) => {
    const s = socketRef.current;
    if (s.connected) {
      s.emit("mark-read", { chatId, userId });
    }
  };

  return {
    socket: socketRef.current,
    joinChat,
    markAsRead,
  };
};
