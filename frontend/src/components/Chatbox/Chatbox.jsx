import React, { useContext, useState } from 'react'
import axios from "axios";
import EmojiPicker from 'emoji-picker-react';
import './Chatbox.css';
import { userLoginId } from "../../contexts/userContext";

const Chatbox = ({ receiverId }) => {
    // CONTEXT VARIABLES
    const { loginId } = useContext(userLoginId);

    //   STATE VARIABLES
    const [userMessage, setUserMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);

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
                setUserMessage("");
                setShowEmoji(false);
            }
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="chat-box-section">
            <div className='chat-input-section'>
                <input
                    className="chat-input"
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={() => setShowEmoji(prev => !prev)} className='emoji-btn'>
                    <img src='https://cdn-icons-png.flaticon.com/512/1023/1023656.png' />
                </button>
                {showEmoji && <EmojiPicker width={"100%"} height={"400px"} style={{ position: "absolute", bottom: "100px" }} onEmojiClick={(e) => { setUserMessage(prev => prev + e.emoji) }} theme='dark' skinTonesDisabled="true" />}
            </div>
            <button onClick={sendMessage} className="send-text">
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
    )
}

export default Chatbox;