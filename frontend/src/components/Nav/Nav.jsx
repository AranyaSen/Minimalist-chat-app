import "./Nav.css";
import profileImg from "../../images/profileImage.svg";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLoginId, userLogInName } from "../../contexts/userContext";

const Nav = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { loginName,setLoginName } = useContext(userLogInName);
  const {setLoginId} = useContext(userLoginId);
  const token = document.cookie;
  const [dropdown, setDropdown] = useState(false);
  const handleProfileDropdown = () => {
    if (token && loginName) {
      setDropdown((prev) => !prev);
    }
  };
  const handleLogout = () => {
    document.cookie = "token=; Path=/;Expires=Thu, 01 Jan 1970 00:00:00 UTC";
    setLoginName(null);
    setLoginId(null);
    navigate("/signin");
  };
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  return (
    <div className="navbar-wrapper">
      <div className="navbar">
        <div className="profile-section">
          <img
            className="user-image"
            src={profileImg}
            onClick={handleProfileDropdown}
          />
          {token && loginName ? (
            <>
              <span>Hi {loginName}</span>
              {dropdown && (
                <div className="user-dropdown-content">
                  <span onClick={handleLogout} ref={dropdownRef}>
                    Logout
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <span className="signup-btn" onClick={() => navigate("/signup")}>
                SignUp
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
