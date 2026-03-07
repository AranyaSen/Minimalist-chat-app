import { useContext, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import "./Chatbox.css";
import { userLoginId } from "../../contexts/userContext";
import { useChatSocket } from "../../hooks/useChatSocket";

const Chatbox = ({ receiverId }) => {
  // CONTEXT VARIABLES
  const { loginId } = useContext(userLoginId);

  const { sendMessage } = useChatSocket(loginId);

  //   STATE VARIABLES
  const [userMessage, setUserMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

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
    <div className="chat-box-section">
      <div className="chat-input-section">
        <input
          className="chat-input"
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
          className="emoji-btn"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/1023/1023656.png" />
        </button>
        {showEmoji && (
          <EmojiPicker
            width={"100%"}
            height={"400px"}
            style={{ position: "absolute", bottom: "100px" }}
            onEmojiClick={(e) => {
              setUserMessage((prev) => prev + e.emoji);
            }}
            theme="dark"
            skinTonesDisabled="true"
          />
        )}
      </div>
      <button onClick={handleSendMessage} className="send-text">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
          fill="#    background-color: rgba(0, 0, 0, 0.9);"
        >
          <path d="M144-192v-576l720 288-720 288Zm72-107 454-181-454-181v109l216 72-216 72v109Zm0 0v-362 362Z" />
        </svg>
      </button>
    </div>
  );
};

export default Chatbox;
