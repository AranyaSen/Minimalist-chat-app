import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage/LandingPage";
import Signup from "@/pages/SignupPage/Signup";
import SignIn from "@/pages/SinginPage/SignIn";
import { ChatPage } from "@/pages/ChatPage/ChatPage";

import { ToastContainer } from "react-toastify";
import { ProtectedRoute } from "@/guards/ProtectedRoute";
import { NotFoundPage } from "@/pages/NotfoundPage/NotfoundPage";
import { refresh } from "@/services/authService/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { UnprotectedRoute } from "@/guards/UnprotectedRoute";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { setAccessToken, setUser, setIsLoggedIn, setIsCheckingAuth } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await refresh();
        if (res.success && res.data?.accessToken) {
          setAccessToken(res.data.accessToken);
          setUser(res.data.user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        setAccessToken("");
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    initializeAuth();
  }, [setAccessToken, setUser, setIsLoggedIn, setIsCheckingAuth]);

  return (
    <>
      <ToastContainer autoClose={1500} theme="light" position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route element={<UnprotectedRoute />}>
            <Route path="/" index element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<SignIn />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<ChatPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
