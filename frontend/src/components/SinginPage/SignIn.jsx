import React, { useContext, useState } from "react";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userLogInName, userLoginId } from "../../contexts/userContext";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
  const navigate = useNavigate();

  // STATE VARIABLES
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // CONTEXT API
  const { setLoginName } = useContext(userLogInName);
  const { setLoginId } = useContext(userLoginId);

  const handleSignIn = async () => {
    const signInData = {
      username: username,
      password: password,
    };
    try {
      if (username && password) {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/signin`,
          signInData
        );
        if (res.status === 200) {
          document.cookie = `token = ${res.data.token}; Path=/; Max-Age=1200`;
          const decodedToken = jwtDecode(res.data.token);
          setLoginName(decodedToken.username);
          setLoginId(decodedToken.userId);
          navigate("/users");
        }
      } else {
        !username && setUsernameError(true);
        !password && setPasswordError(true);
        toast.error("Please enter proper details");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error(err.response.data.message);
      }
    }
  };

  return (
    <div className="container-div">
      <div className="signin-wrapper">
        <h2>SignIn to your account</h2>
        <div className="signin-inputs">
          <div className="input-section">
            <div className="username-section">
              <label className="username-label">Username</label>
              <input
                type="text"
                className="user-inputs"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError(false);
                }}
                onBlur={() => {
                  !username ? setUsernameError(true) : setUsernameError(false);
                }}
              />
            </div>
            {usernameError && (
              <span className="validation-msg">Please enter your username</span>
            )}
          </div>
          <div className="input-section">
            <div className="password-section">
              <label className="password-label">Password</label>
              <input
                type="text"
                className="user-inputs"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                onBlur={() => {
                  !password ? setPasswordError(true) : setPasswordError(false);
                }}
              />
            </div>
            {passwordError && (
              <span className="validation-msg">Please enter your password</span>
            )}
          </div>
          <div className="signin-btn-section">
            <button className="signin-btn" onClick={handleSignIn}>
              Sign In
            </button>
            <ToastContainer />
          </div>
        </div>

        <div className="more-sections">
          <span>New user ? </span>
          <span onClick={() => navigate("/signup")} className="signup-btn">
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
