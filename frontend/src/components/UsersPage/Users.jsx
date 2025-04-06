import React, { useState, useEffect } from "react";
import "./Users.css";
import axios from "axios";
import profile from "../../images/profile.jpg";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import Nav from "../Nav/Nav";
import Texting from "../TextingPage/Texting";

const Message = () => {
  const navigate = useNavigate();

  // STATE VARIABLES
  const [users, setUsers] = useState([]);
  const [login, setLogin] = useState();
  const [userId, setUserId] = useState(null);

  const handleUser = (user) => {
    setUserId(user._id);
  };

  const getUsersList = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user`
      );
      if (res.status === 200) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error(err);
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
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/verify`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  useEffect(() => {
    verifyUser();
    getUsersList();
  }, []);

  if (login === undefined) {
    return <Loader />;
  }

  return (
    <>
      <Nav />
      <div className="users-container-div">
        <div className="wrapper">
          <div className="chat-left-section">
            <div className="users-wrapper">
              {users.map((user, key) => (
                <div
                  className="user-cards"
                  key={key}
                  onClick={() => handleUser(user)}
                >
                  <div className="user-name">{user.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="chat-right-section">
            <Texting receiverId={userId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
