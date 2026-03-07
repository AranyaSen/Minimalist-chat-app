import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL;

export const socket = io(URL, {
  autoConnect: false,
});
// src/hooks/useChatSocket.js

const DEBUG = Boolean(import.meta.env.VITE_SOCKET_DEBUG); // optional: set in env

export const useChatSocket = (userId) => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]); // accumulated messages (deduped)
  const latestRef = useRef({}); // store latest message/reaction to avoid stale closures
  const listenersAttached = useRef(false);

  // attach global socket listeners once
  useEffect(() => {
    if (listenersAttached.current) return;

    const onConnect = () => {
      if (DEBUG) console.log("Socket connected", socket.id);
      setConnected(true);
    };

    const onDisconnect = (reason) => {
      if (DEBUG) console.log("Socket disconnected:", reason);
      setConnected(false);
    };

    const onReceiveMessage = (msg) => {
      if (DEBUG) console.log("receive-message", msg);
      // normalize id
      const id = msg && (msg._id || msg.id);
      setMessages((prev) => {
        // dedupe by id
        if (id && prev.some((m) => m._id === id || m.id === id)) return prev;
        return [...prev, msg];
      });
      latestRef.current.latestMessage = msg;
    };

    const onReactionUpdated = (msg) => {
      if (DEBUG) console.log("reaction-updated", msg);
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
      latestRef.current.latestReaction = msg;
    };

    const onAny = (event, ...args) => {
      if (DEBUG) console.log("socket event:", event, args);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive-message", onReceiveMessage);
    socket.on("reaction-updated", onReactionUpdated);

    // optional: global debug
    if (DEBUG) socket.onAny(onAny);

    listenersAttached.current = true;

    // cleanup: remove the listeners only on full unmount (page unload)
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive-message", onReceiveMessage);
      socket.off("reaction-updated", onReactionUpdated);
      if (DEBUG) socket.offAny(onAny);
      listenersAttached.current = false;
    };
    // intentionally run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle connect + join-room whenever userId becomes available
  useEffect(() => {
    if (!userId) return;

    // ensure connection
    if (!socket.connected) {
      socket.connect();
    }

    // emit join-room — socket.io will queue the emit until connected if not connected yet
    socket.emit("join-room", userId);
    if (DEBUG) console.log("join-room emitted for", userId);

    // Optional: when user (re)joins, you might want to request any undelivered messages via an endpoint.
    // Example (server must support it): socket.emit("fetch-undelivered", userId);

    // do not disconnect here — keep socket for app lifetime
  }, [userId]);

  // public API: send message
  const sendMessage = ({ senderId, receiverId, messageContent }) => {
    if (!senderId || !receiverId || !messageContent) return;
    const payload = { senderId, receiverId, messageContent };
    socket.emit("send-message", payload);
    // optimistic append: add to messages immediately if you want instant UI
    // NOTE: server will emit back the saved message (with _id). Avoid duplicates by dedupe logic above.
    if (DEBUG) console.log("emit send-message", payload);
  };

  // public API: react to message
  const reactToMessage = ({ messageId, reaction }) => {
    if (!messageId || !reaction) return;
    socket.emit("message-reaction", { messageId, reaction });
    if (DEBUG) console.log("emit message-reaction", { messageId, reaction });

    // optimistic UI update: update message locally
    setMessages((prev) =>
      prev.map((m) => (m._id === messageId ? { ...m, messageReaction: reaction } : m))
    );
  };

  // helper to clear messages (for switching conversations if needed)
  const clearMessages = () => setMessages([]);

  return {
    socket,
    connected,
    messages,
    sendMessage,
    reactToMessage,
    clearMessages,
    latestMessage: latestRef.current.latestMessage || null,
    latestReaction: latestRef.current.latestReaction || null,
  };
};