import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const handleSignup = async () => {
    const userData = {
      name: name,
      username: username,
      password: password,
    };
    try {
      if (name && username && password) {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/signup`,
          userData
        );
        if (res.status === 201) {
          navigate("/signin");
        }
      } else {
        !username && setUsernameError(true);
        !name && setNameError(true);
        !password && setPasswordError(true);
        toast.error("Please enter proper details");
      }
    } catch (err) {
      if (err.response && err.status === 409) {
        toast.error(err.response.data.message);
      }
      console.error(err);
    }
  };
  return (
    <div className="container-div">
      <div className="signup-wrapper">
        <h2>Create your account</h2>
        <div className="signup-inputs">
          <div className="input-section">
            <div className="name-section">
              <label className="name-label">Name</label>
              <input
                type="text"
                className="user-inputs"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError(false);
                }}
                onBlur={() => {
                  !name ? setNameError(true) : setNameError(false);
                }}
              />
            </div>
            {nameError && (
              <span className="validation-msg">Please enter your name</span>
            )}
          </div>
          <div className="input-section">
            <div className="username-section">
              <label className="username-label">Username</label>
              <input
                type="text"
                className="user-inputs"
                value={username}
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
                value={password}
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
          <div className="signup-btn-section">
            <button className="signup-btn" onClick={handleSignup}>
              Sign Up
            </button>
          </div>
        </div>
        <ToastContainer />
        <div className="more-sections">
          <span>Already a user ? </span>
          <span onClick={() => navigate("/signin")} className="signin-btn">
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
