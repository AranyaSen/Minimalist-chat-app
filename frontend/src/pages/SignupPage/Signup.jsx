import React, { useState, useEffect } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleSignup = async () => {
    try {
      if (name && username && password) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('image', userImage);
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/signup`, formData);
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

  const handleImageUpload = (e) => {
    const imgfile = e.target.files[0];
    if (imgfile) {
      setUserImage(imgfile);
      setPreviewImage(URL.createObjectURL(imgfile));
    }
  }

  return (
    <div className="container-div">
      <div className="signup-wrapper">
        <h2>Create your account</h2>
        <form>
          <div className="signup-inputs">
            <div className="inputs-left-section">
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
                            <path d="m637-425-62-62q4-38-23-65.5T487-576l-62-62q13-5 27-7.5t28-2.5q70 0 119 49t49 119q0 14-2.5 28t-8.5 27Zm133 133-52-52q36-28 65.5-61.5T833-480q-49-101-144.5-158.5T480-696q-26 0-51 3t-49 10l-58-58q38-15 77.5-21t80.5-6q143 0 261.5 77.5T912-480q-22 57-58.5 103.5T770-292Zm-2 202L638-220q-38 14-77.5 21t-80.5 7q-143 0-261.5-77.5T48-480q22-57 58-104t84-85L90-769l51-51 678 679-51 51ZM241-617q-35 28-65 61.5T127-480q49 101 144.5 158.5T480-264q26 0 51-3.5t50-9.5l-45-45q-14 5-28 7.5t-28 2.5q-70 0-119-49t-49-119q0-14 3.5-28t6.5-28l-81-81Zm287 89Zm-96 96Z" />
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
                            <path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
                          </svg>
                        </span>
                      </>
                    )}
                  </div>
                  {passwordError && (
                    <span className="validation-msg">Please enter your password</span>
                  )}
                </div>
              </div>
            </div>
            <div className="inputs-right-section">
              <div className="input-section">
                <div className="image-upload-section">
                  <label>Upload Image</label>
                  <input type="file" name="image" onChange={handleImageUpload} className="image-upload"/>
                </div>
              </div>
              {previewImage &&
                <div className="image-preview-section">
                  <img src={previewImage} className="image-preview" />
                </div>
              }
            </div>
          </div>
          <div className="signup-btn-section">
            <button className="signup-btn" onClick={handleSignup} type="button">
              Sign Up
            </button>
          </div>
        </form>
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
