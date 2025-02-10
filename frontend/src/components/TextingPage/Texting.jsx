import React, { useContext, useEffect, useRef, useState } from 'react';
import './Texting.css';
import { userLoginId } from '../../contexts/userContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import send from '../../images/send.png';
import UserInfo from '../UserInfo/UserInfo';
import Loader from '../Loader/Loader';

const Texting = () => {
    const URL = 'http://localhost:7000';

    const messagesEndView = useRef();

    const location = useLocation();
    const receiverId = location.state?.receiverId;

    // CONTEXT VARIABLES
    const { loginId } = useContext(userLoginId);

    // STATE VARIABLES
    const [login, setLogin] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [noMessage, setNoMessages] = useState(false);

    const fetchMessages = async () => {
        const payloadData = {
            senderId: receiverId,
            receiverId: loginId,
        }
        try {
            const res = await axios.post(`${URL}/api/messages/receiver`, payloadData);
            if (res.status === 200) {
                setMessages(res.data);
                setNoMessages(false);
                messagesEndView.current?.scrollIntoView({ behavior: "smooth", block: 'end' });
            }
        } catch (err) {
            if (err.response.status === 404) {
                setNoMessages(true);
            }
            console.error(err.response);
        }
    }

    const sendMessage = async () => {
        const payloadData = {
            senderId: loginId,
            receiverId: receiverId,
            messageContent: userMessage,
        }

        try {
            const res = await axios.post(`${URL}/api/messages/sender`, payloadData);
            if (res.status === 201) {
                fetchMessages();
                setUserMessage('');
            }
        } catch (err) {
            console.error(err.response);
        }
    }

    const verifyUser = async () => {
        try {
            const cookies = document.cookie.split(';');
            const jwtToken = cookies.find(token => token.trim().startsWith('token'));
            if (jwtToken) {
                const token = jwtToken.split('=')[1];
                const res = await axios.get(`${URL}/api/user/verify`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (res.status === 200) {
                    setLogin(true);
                }
                else {
                    setLogin(false);
                }
            }
        } catch (error) {
            if (error.response.status === 403) {
                console.log(error.response.message);
            }
        }
    }

    useEffect(() => {
        verifyUser();
        const fetchInterval = setInterval(() => {
            fetchMessages();
        }, 2000);

        return () => { clearInterval(fetchInterval); }
    });

    if (login === undefined) {
        return (
            <Loader/>
        )
    }

    return (
        <div className='container-div'>
            <div className='wrapper'>
                <UserInfo />
                <div className='text-wrapper'>
                    {!noMessage ?
                        <>
                            {messages.map((res, key) => (
                                <div key={key} className={`message-container ${res.sender._id === loginId ? 'right-align' : 'left-align'}`}>
                                    <div className='text-message'>
                                        <span className='text-content'>{res.message}</span>
                                        <span className='text-timestamp'>{new Date(res.timeStamp).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndView}></div>
                        </>
                        :
                        <>
                            <div className='no-message-info'>No messages yet...</div>
                        </>
                    }
                </div>
                <div className='send-box'>
                    <input className='send-message-input' type='text' value={userMessage} placeholder='Type something...' onChange={(e) => setUserMessage(e.target.value)} />
                    <div className='submit-message' onClick={sendMessage}>
                        <img src={send} alt='send-btn' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Texting;