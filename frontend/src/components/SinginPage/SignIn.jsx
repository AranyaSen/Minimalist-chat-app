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
  const [showPassword, setShowPassword] = useState(false);

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
              <div className="password-input">
                {showPassword ? (
                  <>
                    <input
                      type="text"
                      className="user-inputs"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(false);
                      }}
                      onBlur={() => {
                        !password
                          ? setPasswordError(true)
                          : setPasswordError(false);
                      }}
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowPassword(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#    background-color: rgba(0, 0, 0, 0.9);"
                      >
                        <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
                      </svg>
                    </span>
                  </>
                ) : (
                  <>
                    <input
                      type="password"
                      className="user-inputs"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(false);
                      }}
                      onBlur={() => {
                        !password
                          ? setPasswordError(true)
                          : setPasswordError(false);
                      }}
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowPassword(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#    background-color: rgba(0, 0, 0, 0.9);"
                      >
                        <path d="m637-425-62-62q4-38-23-65.5T487-576l-62-62q13-5 27-7.5t28-2.5q70 0 119 49t49 119q0 14-2.5 28t-8.5 27Zm133 133-52-52q36-28 65.5-61.5T833-480q-49-101-144.5-158.5T480-696q-26 0-51 3t-49 10l-58-58q38-15 77.5-21t80.5-6q143 0 261.5 77.5T912-480q-22 57-58.5 103.5T770-292Zm-2 202L638-220q-38 14-77.5 21t-80.5 7q-143 0-261.5-77.5T48-480q22-57 58-104t84-85L90-769l51-51 678 679-51 51ZM241-617q-35 28-65 61.5T127-480q49 101 144.5 158.5T480-264q26 0 51-3.5t50-9.5l-45-45q-14 5-28 7.5t-28 2.5q-70 0-119-49t-49-119q0-14 3.5-28t6.5-28l-81-81Zm287 89Zm-96 96Z" />
                      </svg>
                    </span>
                  </>
                )}
              </div>
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
