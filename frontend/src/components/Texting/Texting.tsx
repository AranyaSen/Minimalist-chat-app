import React, { useEffect, useRef, useState, memo } from "react";
import Chatbox from "@/components/Chatbox/Chatbox";
import { ChevronDown } from "lucide-react";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { TextingProps, EmojiData } from "@/components/Texting/Texting.types";
import { Message } from "@/hooks/useChatSocket.types";
import { reactToMessage } from "@/services/messageService";

const Texting: React.FC<TextingProps> = ({ receiverId }) => {
  const chatSectionRef = useRef<HTMLDivElement>(null);

  /* STATE */
  const [messages] = useState<Message[]>([]);
  const [noMessage] = useState<boolean>(false);
  const [messageDetailsIndex, setMessageDetailsIndex] = useState<number | null>(null);

  const timeFormatter = (time: string) => {
    return Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(time));
  };

  /* MESSAGE OPTION TOGGLE */
  const handleMessageDetailsIndex = (index: number) => {
    setMessageDetailsIndex((prev) => (prev === index ? null : index));
  };

  /* REACT TO MESSAGE */
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

  /* AUTO SCROLL TO LAST MESSAGE */
  useEffect(() => {
    chatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  if (!receiverId) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="h-full w-full bg-primary rounded-[20px] flex justify-center">
          <div className="mt-8 text-[22px]">
            <span>Select a person to chat...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="h-full w-full bg-primary rounded-[20px]">
        {noMessage ? (
          <div className="h-[85%] overflow-y-auto [&::-webkit-scrollbar]:w-[5px]">
            <div className="flex flex-col gap-[14px] pt-8 px-8">Start chatting...</div>
          </div>
        ) : (
          <div className="h-[85%] overflow-y-auto [&::-webkit-scrollbar]:w-[5px]">
            <div className="flex flex-col gap-[14px] pt-8 px-8">
              {messages.map((res, index) => {
                const senderId = typeof res.sender === "string" ? res.sender : res.sender?._id;
                return (
                  <div
                    key={res._id || index}
                    className={senderId === 'loginId' ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={`relative h-fit w-fit max-w-[65%] flex gap-[10px] items-end p-4 wrap-break-word rounded-[20px] ${
                        senderId === 'loginId'
                          ? "text-[20px] bg-secondary text-[#0d1f22]"
                          : "bg-[#4d426d]"
                      }`}
                    >
                      {res.message}

                      <span className="text-[10px] relative min-w-[48px]">
                        <p className="m-0 p-0 absolute -top-[5px] right-0">
                          {timeFormatter(res.timeStamp)}
                        </p>
                      </span>

                      {senderId === 'loginId' && (
                        <ChevronDown
                          width={14}
                          className="cursor-pointer"
                          onClick={() => handleMessageDetailsIndex(index)}
                        />
                      )}

                      {messageDetailsIndex === index && (
                        <div className="absolute right-0 -top-[60px]">
                          <EmojiPicker
                            allowExpandReactions={false}
                            onEmojiClick={(emoji: EmojiClickData) =>
                              handleMessageReact(emoji as EmojiData, res._id || "")
                            }
                            theme={Theme.DARK}
                            reactionsDefaultOpen
                          />
                        </div>
                      )}

                      {res.messageReaction && (
                        <div className="absolute flex justify-center items-center w-[30px] h-[30px] right-0 -bottom-[10px] bg-primary rounded-full">
                          {res.messageReaction}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div ref={chatSectionRef}></div>
            </div>
          </div>
        )}

        <Chatbox receiverId={receiverId} />
      </div>
    </div>
  );
};

export default memo(Texting);
