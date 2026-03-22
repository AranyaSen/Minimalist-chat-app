import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "@/components/Loader/Loader";

export const UnprotectedRoute = () => {
  const { isLoggedIn, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <Loader />;
  }

  if (isLoggedIn) {
    return <Navigate to={"/chat"} />;
  }
  return <Outlet />;
};
