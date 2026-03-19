import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { userLoginId, userLogInName } from "../../contexts/userContext";
import Nav from "../../components/Nav/Nav";
import { User, Lock, LogIn, ArrowRight, Eye, EyeOff } from "lucide-react";
import { jwtDecode } from "jwt-decode";

/**
 * SignIn Component - Handles user login
 */
const SignIn = () => {
  const navigate = useNavigate();

  // CONTEXT VARIABLES
  const { setLoginName } = useContext(userLogInName);
  const { setLoginId } = useContext(userLoginId);

  // STATE VARIABLES
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handleSignIn - Processes the login request
   */
  const handleSignIn = async (e) => {
    if (e) e.preventDefault();
    if (!username || !password) {
      setUsernameError(!username);
      setPasswordError(!password);
      return toast.error("Please enter proper details");
    }

    setIsLoading(true);
    const signInData = { username, password };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/signin`,
        signInData
      );

      if (res.status === 200) {
        toast.success(res.data.message || "Login successful!");

        // Use jwtDecode as in original code
        const decodedToken = jwtDecode(res.data.token);
        setLoginName(decodedToken.username);
        setLoginId(decodedToken.userId);

        // Store token in cookies
        document.cookie = `token=${res.data.token}; Path=/; Max-Age=1200`;

        navigate("/users");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white flex flex-col">
      <Nav />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Glassmorphic Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-2xl mb-6">
                <LogIn className="text-secondary" size={32} />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
              <p className="text-gray-400 text-sm">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                <div className="relative group">
                  <div
                    className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${usernameError ? "text-red-400" : "text-gray-500 group-focus-within:text-secondary"}`}
                  >
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError(false);
                    }}
                    onBlur={() => (!username ? setUsernameError(true) : setUsernameError(false))}
                    className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all outline-none ${
                      usernameError
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : "border-white/10 focus:border-secondary focus:ring-secondary/30"
                    }`}
                    placeholder="your_username"
                  />
                </div>
                {usernameError && (
                  <p className="text-xs text-red-400 mt-1 ml-1 animate-pulse">
                    Please enter your username
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <a href="#" className="text-xs text-secondary hover:underline transition-all">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <div
                    className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${passwordError ? "text-red-400" : "text-gray-500 group-focus-within:text-secondary"}`}
                  >
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(false);
                    }}
                    onBlur={() => (!password ? setPasswordError(true) : setPasswordError(false))}
                    className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-12 text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all outline-none ${
                      passwordError
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : "border-white/10 focus:border-secondary focus:ring-secondary/30"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-red-400 mt-1 ml-1 animate-pulse">
                    Please enter your password
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-secondary text-primary font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-400 shadow-lg shadow-secondary/20 transform active:scale-95 transition-all duration-300 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-gray-400 text-sm">
                New user?{" "}
                <Link to="/signup" className="text-secondary font-bold hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
