import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useUserStore from "@/store/useUserStore";
import LandingPage from "@/pages/LandingPage/LandingPage";
import Signup from "@/pages/SignupPage/Signup";
import SignIn from "@/pages/SinginPage/SignIn";
import Users from "@/pages/UsersPage/Users";
import Texting from "@/components/Texting/Texting";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppProps } from "@/App.types";

const App: React.FC<AppProps> = () => {
  const initializeAuth = useUserStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/users" element={<Users />} />
          <Route path="/texting" element={<Texting receiverId="" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
