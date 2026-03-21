import apiClient from "@/utils/apiClient";
import { SignInFormData } from "@/pages/SinginPage/SignIn.types";

export const signIn = (data: SignInFormData) => {
  return apiClient.post("/api/user/signin", data);
};

export const signUp = (formData: FormData) => {
  return apiClient.post("/api/user/signup", formData);
};

export const getUsers = () => {
  return apiClient.get("/api/user");
};

export const verifyToken = (token: string) => {
  return apiClient.get("/api/user/verify", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default {
  signIn,
  signUp,
  getUsers,
  verifyToken,
};
