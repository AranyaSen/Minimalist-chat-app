import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Nav from "../../components/Nav/Nav";
import { User, Lock, UserPlus, ArrowRight, Camera, Eye, EyeOff } from "lucide-react";

/**
 * Signup Component - Handles user registration
 */
const Signup = () => {
  const navigate = useNavigate();

  // STATE VARIABLES
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handleImageUpload - Handles the profile picture selection
   */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  /**
   * handleSignup - Processes the registration request
   */
  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    if (!name || !username || !password) {
      setNameError(!name);
      setUsernameError(!username);
      setPasswordError(!password);
      return toast.error("Please enter proper details");
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);
    if (userImage) formData.append("image", userImage);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/signup`, formData);
      if (res.status === 201) {
        toast.success("Account created successfully!");
        navigate("/signin");
      }
    } catch (err) {
      if (err.response && err.status === 409) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white flex flex-col">
      <Nav />

      <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-24">
        <div className="w-full max-w-2xl animate-fade-in">
          {/* Glassmorphic Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-2xl mb-6">
                <UserPlus className="text-secondary" size={32} />
              </div>
              <h1 className="text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-gray-400 text-sm">Join the minimalist chat community</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-8">
              <div className="flex flex-col md:flex-row gap-10">
                {/* Left side: Inputs */}
                <div className="flex-[1.5] space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                    <div className="relative group">
                      <div
                        className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${nameError ? "text-red-400" : "text-gray-500 group-focus-within:text-secondary"}`}
                      >
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setNameError(false);
                        }}
                        onBlur={() => (!name ? setNameError(true) : setNameError(false))}
                        className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all outline-none ${
                          nameError
                            ? "border-red-500/50 focus:ring-red-500/30"
                            : "border-white/10 focus:border-secondary focus:ring-secondary/30"
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {nameError && (
                      <p className="text-[10px] text-red-400 mt-1 ml-1">Please enter your name</p>
                    )}
                  </div>

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
                        onBlur={() =>
                          !username ? setUsernameError(true) : setUsernameError(false)
                        }
                        className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all outline-none ${
                          usernameError
                            ? "border-red-500/50 focus:ring-red-500/30"
                            : "border-white/10 focus:border-secondary focus:ring-secondary/30"
                        }`}
                        placeholder="johndoe_99"
                      />
                    </div>
                    {usernameError && (
                      <p className="text-[10px] text-red-400 mt-1 ml-1">
                        Please enter your username
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
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
                        onBlur={() =>
                          !password ? setPasswordError(true) : setPasswordError(false)
                        }
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
                      <p className="text-[10px] text-red-400 mt-1 ml-1">
                        Please enter your password
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side: Profile Upload */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative group cursor-pointer">
                    <div
                      className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl border-2 border-dashed border-white/20 overflow-hidden flex items-center justify-center transition-all ${previewImage ? "border-secondary/50" : "group-hover:border-secondary/50 group-hover:bg-secondary/5"}`}
                    >
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Camera
                            className="mx-auto text-gray-500 mb-2 group-hover:text-secondary transition-colors"
                            size={32}
                          />
                          <span className="text-[10px] text-gray-500 font-medium group-hover:text-secondary">
                            Click to upload
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="mt-4 text-xs text-gray-500 text-center">
                    Profile Picture <br /> (Optional)
                  </p>
                </div>
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
                    Create Account <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-gray-400 text-sm">
                Already a user?{" "}
                <Link to="/signin" className="text-secondary font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
