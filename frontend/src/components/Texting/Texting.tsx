import React, { useEffect, useRef, useState, memo } from "react";
import Chatbox from "@/components/Chatbox/Chatbox";
import { ChevronDown, MessageSquare, Loader2, ArrowLeft, User as UserIcon } from "lucide-react";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { TextingProps, EmojiData } from "@/components/Texting/Texting.types";
import { MessageType } from "@/hooks/useChatSocket.types";
import { reactToMessage } from "@/services/messageService";
import { useAuthStore } from "@/store/useAuthStore";
import { useMessagesQuery } from "@/queries/useMessagesQuery";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useQueryClient } from "@tanstack/react-query";
import { useConversationsQuery } from "@/queries/useConversationsQuery";
import { getReceiverInfo } from "@/utils/chatUtils";

const Texting: React.FC<TextingProps> = ({ chatId, receiverId, onBack }) => {
  const { user: currentUser } = useAuthStore();
  const { data: conversationList = [] } = useConversationsQuery();

  const { name: receiverName, image: receiverImage } = getReceiverInfo(
    chatId,
    receiverId,
    currentUser?.id || "",
    conversationList,
    [] // We don't have searchedUsers here, but getReceiverInfo handles it
  );
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
      {/* Chat Header */}
      <header className="p-4 md:p-6 border-b border-white/5 bg-white/5 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          {/* Back Button (Mobile Only) */}
          <button
            onClick={onBack}
            className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border-2 border-secondary/20 shadow-lg">
              {receiverImage ? (
                <img
                  src={receiverImage}
                  alt={receiverName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                  <UserIcon size={20} className="text-secondary" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm md:text-base leading-none mb-1">
                {receiverName || "Chat"}
              </h3>
              {/* <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-[10px] md:text-xs text-gray-400 font-medium">Online</span>
                </div> */}
            </div>
          </div>
        </div>
      </header>

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
