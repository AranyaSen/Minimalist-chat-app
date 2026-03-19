import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userLoginId, userLogInName } from "../../contexts/userContext";

const Nav = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { loginName, setLoginName } = useContext(userLogInName);
  const { loginId, setLoginId } = useContext(userLoginId);
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
    <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 h-[70px] rounded-2xl shadow-2xl">
        <div className="h-full flex items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
              <span className="text-primary font-black text-xl">M</span>
            </div>
            <span className="font-bold text-xl hidden sm:block tracking-tight">MinimalistChat</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative flex items-center gap-3">
              {token && loginName ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-gray-400">Welcome back,</p>
                    <p className="text-sm font-bold text-secondary">{loginName}</p>
                  </div>
                  <div
                    className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-secondary/30 cursor-pointer hover:border-secondary transition-all"
                    onClick={handleProfileDropdown}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={`${import.meta.env.VITE_BACKEND_URL}/api/user/${loginId}/image`}
                      alt={loginName}
                    />
                  </div>
                  {dropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-[60px] right-0 w-48 bg-primary/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 animate-fade-in"
                    >
                      <button
                        className="w-full text-left px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        onClick={handleLogout}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/signin"
                    className="px-5 py-2 text-sm font-bold text-gray-300 hover:text-white transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 text-sm font-bold bg-secondary text-primary rounded-xl hover:bg-orange-400 transition-all transform hover:scale-105"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
