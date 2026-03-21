import { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiResponseType } from "@/types/api.types";
import { useAuthStore } from "@/store/useAuthStore";
import { UserType } from "@/store/useAuthStore.types";

export const setupResponseInterceptor = (apiClient: AxiosInstance) => {
  apiClient.interceptors.response.use(
    (response: AxiosResponse<ApiResponseType<any>>) => {
      return response.data as any;
    },

    async (error: AxiosError<ApiResponseType<any>>) => {
      const errorMessage = error.response?.data?.message;
      const originalRequest: (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined =
        error.config;

      if (!originalRequest) return Promise.reject(error);

      if (errorMessage === "Invalid or expired token" && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res: ApiResponseType<{ accessToken: string; user: UserType }> =
            await apiClient.post("/api/auth/refresh");

          if (res.success && res.data?.accessToken) {
            useAuthStore.getState().setAccessToken(res.data?.accessToken);
            useAuthStore.getState().setUser(res.data?.user);

            originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};
