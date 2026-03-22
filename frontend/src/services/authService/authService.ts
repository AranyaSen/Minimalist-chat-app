import { ApiResponseType } from "@/types/api.types";
import { apiClient } from "@/services/api/apiClient";
import { SiginInResponseType } from "@/services/authService/authService.types";
import { SignInFormData } from "@/pages/SinginPage/SignIn.types";
import { ParticipantUser } from "@/pages/ChatPage/Chat.types";

export const signIn = (data: SignInFormData): Promise<ApiResponseType<SiginInResponseType>> => {
  return apiClient.post("/api/auth/signin", data);
};

export const signUp = (formData: FormData): Promise<ApiResponseType> => {
  return apiClient.post("/api/auth/signup", formData);
};

export const verifyToken = (): Promise<ApiResponseType<ParticipantUser>> => {
  return apiClient.get("/api/auth/profile");
};

export const refresh = (): Promise<ApiResponseType<SiginInResponseType>> => {
  return apiClient.post("/api/auth/refresh");
};

export const logout = (): Promise<ApiResponseType> => {
  return apiClient.post("/api/auth/logout");
};
