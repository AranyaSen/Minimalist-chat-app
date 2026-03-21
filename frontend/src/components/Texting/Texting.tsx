import React, { useEffect, useRef, useState, memo } from "react";
import Chatbox from "@/components/Chatbox/Chatbox";
import { ChevronDown, MessageSquare, Loader2 } from "lucide-react";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { TextingProps, EmojiData } from "@/components/Texting/Texting.types";
import { MessageType } from "@/hooks/useChatSocket.types";
import { reactToMessage } from "@/services/messageService";
import { useAuthStore } from "@/store/useAuthStore";
import { useMessagesQuery } from "@/queries/useMessagesQuery";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useQueryClient } from "@tanstack/react-query";

const Texting: React.FC<TextingProps> = ({ chatId, receiverId }) => {
  const { user: currentUser } = useAuthStore();
  const chatSectionRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const [messageDetailsIndex, setMessageDetailsIndex] = useState<number | null>(null);

  // Fetch messages via REST
  const { data: messages = [], isLoading } = useMessagesQuery(chatId);

  // Socket connection
  const { socket, joinChat, markAsRead } = useChatSocket(currentUser?.id || "");

  // Join the chat room when chatId changes
  useEffect(() => {
    if (!chatId) return;
    joinChat(chatId);
    markAsRead(chatId);
  }, [chatId]);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket || !chatId) return;

    const onMessageReceived = (newMessage: MessageType) => {
      // Only add if the message belongs to this chat
      if (newMessage.chatId === chatId || (newMessage.chatId as any)?._id === chatId) {
        queryClient.setQueryData(["messages", chatId], (old: MessageType[] = []) => {
          // Prevent duplicates
          const exists = old.find((m) => m._id === newMessage._id);
          if (exists) return old;
          return [...old, newMessage];
        });
        // Mark as read since user is viewing this chat
        markAsRead(chatId);
      }

      // Refresh conversation list to update lastMessage
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    socket.on("message-received", onMessageReceived);

    return () => {
      socket.off("message-received", onMessageReceived);
    };
  }, [socket, chatId, queryClient, markAsRead]);

  const timeFormatter = (time: string) => {
    try {
      return Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(time));
    } catch {
      return "";
    }
  };

  const handleMessageDetailsIndex = (index: number) => {
    setMessageDetailsIndex((prev) => (prev === index ? null : index));
  };

  const handleMessageReact = async (emoji: EmojiData, id: string) => {
    try {
      await reactToMessage(id, emoji.emoji);
      setMessageDetailsIndex(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  // Auto scroll to last message
  useEffect(() => {
    chatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chatId) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mb-6">
          <MessageSquare className="text-secondary" size={40} />
        </div>
        <h3 className="text-2xl font-bold mb-2">Your Messages</h3>
        <p className="text-gray-400 max-w-xs">
          Select a contact from the sidebar to start a new conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white/5 relative overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-secondary" />
          </div>
        ) : messages?.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p className="bg-white/5 px-6 py-2 rounded-full border border-white/5">
              Start of your conversation
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages?.map((msg: MessageType, index: number) => {
              const senderId = typeof msg.senderId === "string" ? msg.senderId : msg.senderId?._id;
              const isMe = senderId === currentUser?.id;

              return (
                <div
                  key={msg._id || index}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`relative group max-w-[75%] md:max-w-[65%] flex flex-col gap-1 p-4 rounded-2xl shadow-sm transition-all ${
                      isMe
                        ? "bg-secondary text-primary rounded-tr-none"
                        : "bg-white/10 text-white rounded-tl-none border border-white/5 shadow-black/20"
                    }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed wrap-break-word">
                      {msg.content}
                    </p>

                    <div
                      className={`flex items-center gap-2 mt-1 ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <span className="text-[10px] font-medium opacity-60">
                        {timeFormatter(msg.createdAt)}
                      </span>

                      {isMe && (
                        <button
                          onClick={() => handleMessageDetailsIndex(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronDown size={14} />
                        </button>
                      )}
                    </div>

                    {messageDetailsIndex === index && (
                      <div
                        className={`absolute z-20 bottom-full ${isMe ? "right-0" : "left-0"} mb-2 animate-fade-in`}
                      >
                        <EmojiPicker
                          allowExpandReactions={false}
                          onEmojiClick={(emoji: EmojiClickData) =>
                            handleMessageReact(emoji as EmojiData, msg._id || "")
                          }
                          theme={Theme.DARK}
                          reactionsDefaultOpen
                          width={280}
                          height={350}
                        />
                      </div>
                    )}

                    {msg.messageReaction && msg.messageReaction.length > 0 && (
                      <div
                        className={`absolute -bottom-3 ${isMe ? "left-2" : "right-2"} flex items-center justify-center w-7 h-7 bg-primary border border-white/10 rounded-full shadow-lg text-sm`}
                      >
                        {msg.messageReaction[0]?.type}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatSectionRef}></div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <footer className="p-6 bg-white/5 border-t border-white/5">
        <Chatbox chatId={chatId} receiverId={receiverId} />
      </footer>
    </div>
  );
};

export default memo(Texting);
