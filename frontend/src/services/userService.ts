import { apiClient } from "@/services/api/apiClient";
import { SignInFormData } from "@/pages/SinginPage/SignIn.types";
import { ApiResponseType } from "@/types/api.types";

import { User } from "@/pages/UsersPage/Users.types";

export const signIn = (data: SignInFormData): Promise<ApiResponseType<{ token: string }>> => {
  return apiClient.post("/api/auth/signin", data);
};

export const signUp = (formData: FormData): Promise<ApiResponseType> => {
  return apiClient.post("/api/auth/signup", formData);
};

export const getUsers = (): Promise<ApiResponseType<User[]>> => {
  return apiClient.get("/api/user");
};

export const verifyToken = (): Promise<ApiResponseType<User>> => {
  return apiClient.get("/api/auth/profile");
};

export default {
  signIn,
  signUp,
  getUsers,
  verifyToken,
};
