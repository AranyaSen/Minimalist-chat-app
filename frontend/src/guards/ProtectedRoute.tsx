import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "@/components/Loader/Loader";

export const ProtectedRoute = () => {
  const { accessToken, isLoggedIn, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <Loader />;
  }

  if (!accessToken || !isLoggedIn) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
};
