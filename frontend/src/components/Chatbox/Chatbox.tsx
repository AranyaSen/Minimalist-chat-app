import React, { useState } from "react";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { ChatboxProps } from "@/components/Chatbox/Chatbox.types";
import { Send, Smile } from "lucide-react";
import { sendMessage } from "@/services/messageService";
import { useQueryClient } from "@tanstack/react-query";

const Chatbox: React.FC<ChatboxProps> = ({ chatId, receiverId }) => {
  const [userMessage, setUserMessage] = useState<string>("");
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !chatId || isSending) return;

    const messageContent = userMessage.trim();
    setUserMessage("");
    setShowEmoji(false);
    setIsSending(true);

    try {
      await sendMessage(chatId, messageContent, receiverId);
      // The controller emits "message-received" via socket, which Texting.tsx
      // listens for and appends to the cache. We also invalidate to be safe.
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } catch (error) {
      console.error("Failed to send message:", error);
      // Restore the message on failure so user can retry
      setUserMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative w-full">
      {showEmoji && (
        <div className="absolute bottom-full right-0 mb-4 z-50 animate-fade-in">
          <EmojiPicker
            width={320}
            height={400}
            onEmojiClick={(e: EmojiClickData) => {
              setUserMessage((prev) => prev + e.emoji);
            }}
            theme={Theme.DARK}
            skinTonesDisabled={true}
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1 group">
          <input
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 pl-6 pr-14 text-white placeholder-white/20 focus:outline-none focus:border-secondary transition-all"
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            disabled={isSending}
          />
          <button
            onClick={() => setShowEmoji((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-secondary transition-colors"
          >
            <Smile size={24} />
          </button>
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!userMessage.trim() || isSending}
          className="w-14 h-14 flex items-center justify-center bg-secondary text-primary rounded-2xl hover:bg-orange-400 transition-all shadow-lg shadow-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
        >
          <Send
            size={24}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
