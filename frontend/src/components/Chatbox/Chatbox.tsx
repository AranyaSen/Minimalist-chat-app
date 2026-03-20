import React, { useState } from "react";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import useUserStore from "@/store/useUserStore";
import { useChatSocket } from "@/hooks/useChatSocket";
import { ChatboxProps } from "@/components/Chatbox/Chatbox.types";

const Chatbox: React.FC<ChatboxProps> = ({ receiverId }) => {
  // STORE VARIABLES
  const loginId = useUserStore((state) => state.loginId);

  const { sendMessage } = useChatSocket(loginId);

  //   STATE VARIABLES
  const [userMessage, setUserMessage] = useState<string>("");
  const [showEmoji, setShowEmoji] = useState<boolean>(false);

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    sendMessage({
      senderId: loginId,
      receiverId: receiverId,
      messageContent: userMessage,
    });

    setUserMessage("");
    setShowEmoji(false);
  };

  return (
    <div className="relative flex items-center px-8 h-[15%] justify-between">
      <div className="w-full h-full flex items-center relative">
        <input
          className="w-[99%] h-[45%] border-none bg-[#f2efea] text-[#0D1F22] outline-1 outline-gray-500 text-[20px] p-0 indent-5 rounded-[20px] focus:transition-all focus:duration-100 focus:ease-out focus:border-none focus:outline-1 focus:outline-secondary"
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button
          onClick={() => setShowEmoji((prev) => !prev)}
          className="rounded-full border-none w-[35px] h-[35px] absolute right-5 cursor-pointer flex justify-center items-center"
        >
          <img
            className="w-full"
            src="https://cdn-icons-png.flaticon.com/512/1023/1023656.png"
            alt="emoji"
          />
        </button>
        {showEmoji && (
          <div className="absolute bottom-[100px] w-full">
            <EmojiPicker
              width={"100%"}
              height={"400px"}
              onEmojiClick={(e: EmojiClickData) => {
                setUserMessage((prev) => prev + e.emoji);
              }}
              theme={Theme.DARK}
              skinTonesDisabled={true}
            />
          </div>
        )}
      </div>
      <button
        onClick={handleSendMessage}
        className="w-[50px] h-[45%] flex justify-center items-center cursor-pointer right-0 rounded-full border-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
          className="w-full h-full fill-[#4d426d]"
        >
          <path d="M144-192v-576l720 288-720 288Zm72-107 454-181-454-181v109l216 72-216 72v109Zm0 0v-362 362Z" />
        </svg>
      </button>
    </div>
  );
};

export default Chatbox;
