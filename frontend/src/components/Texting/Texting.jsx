import React, { useContext, useEffect, useRef, useState, memo } from "react";
import "./Texting.css";
import { userLoginId } from "../../contexts/userContext";
import axios from "axios";
import Loader from "../Loader/Loader";
import Chatbox from "../Chatbox/Chatbox";
import { ChevronDown } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useChatSocket } from "../../hooks/useChatSocket";

const Texting = ({ receiverId }) => {
  const chatSectionRef = useRef();

  /* CONTEXT */
  const { loginId } = useContext(userLoginId);

  /* SOCKET HOOK */
  const { messages: socketMessages } = useChatSocket(loginId);

  /* STATE */
  const [login, setLogin] = useState(false);
  const [messages, setMessages] = useState([]);
  const [noMessage, setNoMessages] = useState(false);
  const [messageDetailsIndex, setMessageDetailsIndex] = useState(null);

  const timeFormatter = (time) => {
    return Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(time));
  };

  /* FETCH CONVERSATION HISTORY */
  const fetchMessages = async () => {
    const payloadData = {
      senderId: receiverId,
      receiverId: loginId,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/conversation`,
        payloadData
      );

      if (res.status === 200) {
        setMessages(res.data);
        setNoMessages(false);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setNoMessages(true);
      }
      console.error(err);
    }
  };

  /* VERIFY USER */
  const verifyUser = async () => {
    try {
      const cookies = document.cookie.split(";");
      const jwtToken = cookies.find((token) =>
        token.trim().startsWith("token")
      );

      if (jwtToken) {
        const token = jwtToken.split("=")[1];

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/verify`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 200) setLogin(true);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.log(error.response.message);
      }
    }
  };

  /* MESSAGE OPTION TOGGLE */
  const handleMessageDetailsIndex = (index) => {
    setMessageDetailsIndex((prev) => (prev === index ? null : index));
  };

  /* REACT TO MESSAGE */
  const handleMessageReact = async (emoji, id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/react/${id}`,
        { reaction: emoji.emoji }
      );

      setMessageDetailsIndex(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  /* INITIAL DATA FETCH */
  useEffect(() => {
    verifyUser();
    fetchMessages();
  }, [receiverId]);

  /* REALTIME SOCKET MESSAGE LISTENER */
  useEffect(() => {
    if (!socketMessages || socketMessages.length === 0) return;

    const latestMessage = socketMessages[socketMessages.length - 1];

    const senderIdFromMsg = latestMessage.sender?._id || latestMessage.sender;

    const receiverIdFromMsg =
      latestMessage.receiver?._id || latestMessage.receiver;

    // ensure message belongs to this chat
    const isCurrentChat =
      (String(senderIdFromMsg) === String(loginId) &&
        String(receiverIdFromMsg) === String(receiverId)) ||
      (String(senderIdFromMsg) === String(receiverId) &&
        String(receiverIdFromMsg) === String(loginId));

    if (!isCurrentChat) return;

    console.log("📩 New message received via socket:", latestMessage);

    setMessages((prev) => {
      const exists = prev.find((msg) => msg._id === latestMessage._id);
      if (exists) return prev;

      return [...prev, latestMessage];
    });

    setNoMessages(false);
  }, [socketMessages, receiverId, loginId]);

  /* AUTO SCROLL TO LAST MESSAGE */
  useEffect(() => {
    chatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (login === undefined) return <Loader />;

  if (!receiverId) {
    return (
      <div className="text-container-div">
        <div className="text-wrapper receiver-id-not-found">
          <div className="text-info">
            <span>Select a person to chat...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-container-div">
      <div className="text-wrapper">
        {noMessage ? (
          <div className="chat-section">
            <div className="chat-inner-section">Start chatting...</div>
          </div>
        ) : (
          <div className="chat-section">
            <div className="chat-inner-section">
              {messages.map((res, index) => (
                <div
                  key={res._id || index}
                  className={
                    res.sender._id === loginId
                      ? "message-right-section"
                      : "message-left-section"
                  }
                >
                  <div className="message">
                    {res.message}

                    <span className="show-timestamp">
                      <p className="timestamp">
                        {timeFormatter(res.timeStamp)}
                      </p>
                    </span>

                    {res.sender._id === loginId && (
                      <ChevronDown
                        width={14}
                        cursor={"pointer"}
                        onClick={() => handleMessageDetailsIndex(index)}
                      />
                    )}

                    {messageDetailsIndex === index && (
                      <div className="message-details">
                        <EmojiPicker
                          allowExpandReactions={false}
                          onEmojiClick={(emoji) =>
                            handleMessageReact(emoji, res._id)
                          }
                          theme="dark"
                          reactionsDefaultOpen
                        />
                      </div>
                    )}

                    {res.messageReaction && (
                      <div className="reaction">{res.messageReaction}</div>
                    )}
                  </div>
                </div>
              ))}

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
