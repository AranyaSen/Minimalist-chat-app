import React, { useState, useEffect, useContext } from "react";
import "./Users.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import Nav from "../../components/Nav/Nav";
import Texting from "../../components/Texting/Texting";
import { userLoginId } from "../../contexts/userContext";

const Message = () => {
  const navigate = useNavigate();

  // STATE VARIABLES
  const [users, setUsers] = useState([]);
  const [login, setLogin] = useState();
  const [userId, setUserId] = useState(null);
  const { loginId } = useContext(userLoginId);

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
              {users.map((user, index) => (
                <div className="user-cards">
                  <div
                    className="user"
                    key={index}
                    onClick={() => handleUser(user)}
                  >
                    <div className="user-profile-image">
                      <img src={`${import.meta.env.VITE_BACKEND_URL}/api/user/${user._id}/image`} />
                    </div>
                    <div className="user-name">
                      {user._id === loginId ? <span>You</span> : <span>{user.name}</span>}
                    </div>
                  </div>
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
