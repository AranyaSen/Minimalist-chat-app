import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const Nav = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isLoggedIn, user, setIsLoggedIn, setUser, setAccessToken } = useAuthStore();
  const [dropdown, setDropdown] = useState<boolean>(false);

  const handleProfileDropdown = () => {
    if (isLoggedIn) {
      setDropdown((prev: boolean) => !prev);
    }
  };

  const handleLogout = () => {
    // Clear storage and store
    setAccessToken("");
    setUser(null);
    setIsLoggedIn(false);
    setDropdown(false);
    navigate("/signin");
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
              {isLoggedIn && user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-gray-400">Welcome back,</p>
                    <p className="text-sm font-bold text-secondary truncate max-w-[120px]">
                      {user.fullName}
                    </p>
                  </div>
                  <div
                    className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-secondary/30 cursor-pointer hover:border-secondary transition-all shadow-lg hover:shadow-secondary/20"
                    onClick={handleProfileDropdown}
                  >
                    {user?.image && user.image.length > 0 ? (
                      <img
                        className="w-full h-full object-cover"
                        src={user.image}
                        alt={user.fullName}
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                        <UserIcon className="text-secondary" size={24} />
                      </div>
                    )}
                  </div>
                  {dropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-[60px] right-0 w-56 bg-primary/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2 animate-fade-in z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-1 sm:hidden">
                        <p className="text-xs text-gray-400">Welcome,</p>
                        <p className="text-sm font-bold text-secondary truncate">{user.fullName}</p>
                      </div>
                      <button
                        className="w-full text-left px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center gap-3 group"
                        onClick={handleLogout}
                      >
                        <div className="p-2 rounded-lg bg-error/10 text-error group-hover:bg-error group-hover:text-white transition-all">
                          <LogOut size={16} />
                        </div>
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
                    className="px-5 py-2 text-sm font-bold bg-secondary text-primary rounded-xl hover:bg-orange-400 transition-all transform hover:scale-105 shadow-lg shadow-secondary/10"
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
