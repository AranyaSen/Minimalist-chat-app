import React, { useContext, useEffect, useRef, useState, memo } from "react";
import "./Texting.css";
import { userLoginId } from "../../contexts/userContext";
import axios from "axios";
import Loader from "../Loader/Loader";

const Texting = ({ receiverId }) => {
  const chatSectionRef = useRef();

  // CONTEXT VARIABLES
  const { loginId } = useContext(userLoginId);

  // STATE VARIABLES
  const [login, setLogin] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [noMessage, setNoMessages] = useState(false);

  const timeFormatter = (e) => {
    return Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(e));
  };

  const fetchMessages = async () => {
    const payloadData = {
      senderId: receiverId,
      receiverId: loginId,
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/receiver`,
        payloadData
      );
      if (res.status === 200) {
        setMessages(res.data);
        setNoMessages(false);
      }
    } catch (err) {
      if (err.response.status === 404) {
        setNoMessages(true);
      }
      console.error(err.response);
    }
  };

  const sendMessage = async () => {
    const payloadData = {
      senderId: loginId,
      receiverId: receiverId,
      messageContent: userMessage,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/sender`,
        payloadData
      );
      if (res.status === 201) {
        // fetchMessages();
        setUserMessage("");
      }
    } catch (err) {
      console.error(err.response);
    }
  };

  const verifyUser = async () => {
    try {
      const cookies = document.cookie.split(";");
      const jwtToken = cookies.find((token) =>
        token.trim().startsWith("token")
      );
      if (jwtToken) {
        const token = jwtToken.split("=")[1];
        const res = await axios.get(`${URL}/api/user/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setLogin(true);
        } else {
          setLogin(false);
        }
      }
    } catch (error) {
      if (error.response.status === 403) {
        console.log(error.response.message);
      }
    }
  };

  // USEEFFECT FOR API CALLS
  useEffect(() => {
    verifyUser();
    fetchMessages();
  }, [receiverId]);

  // USEEFFECT FOR LISTENING TO THE WEBSOCKET
  useEffect(() => {
    const socket = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}`);
    socket.onopen = () => {
      console.log("Websocket connected!");
    };
    socket.onmessage = (e) => {
      const parsedData = JSON.parse(e.data);
      if (parsedData.type === "new-message") {
        const messageData = parsedData.data;
        if (
          (messageData.sender === loginId &&
            messageData.receiver === receiverId) ||
          (messageData.sender === receiverId &&
            messageData.receiver === loginId)
        ) {
          fetchMessages();
        }
      }
    };
    socket.onclose = () => {
      console.log("Websocket disconnected");
    };
    socket.onerror = (err) => console.error("❌ WebSocket error", err);
    return () => {
      socket.close();
    };
  }, [receiverId, loginId]);

  // SCROLL AT BOTTOM OF CHAT WHEN NEW CHAT OPENS
  useEffect(() => {
    chatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (login === undefined) {
    return <Loader />;
  }

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
          <div className="chat-section">Start chatting...</div>
        ) : (
          <>
            <div className="chat-section">
              {messages.map((res, index) => {
                return (
                  <div
                    className={
                      res.sender._id === loginId
                        ? "message-right-section"
                        : "message-left-section"
                    }
                    key={index}
                  >
                    <div className="message">
                      {res.message}
                      <span className="show-timestamp">
                        <p className="timestamp">
                          {timeFormatter(res.timeStamp)}
                        </p>
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatSectionRef}></div>
            </div>
          </>
        )}
        <div className="chat-box-section">
          <input
            className="chat-box"
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} className="send-text">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Texting);
