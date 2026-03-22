import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiResponseType } from "@/types/api.types";
import { useAuthStore } from "@/store/useAuthStore";
import { UserType } from "@/store/useAuthStore.types";

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:7000",
  withCredentials: true,
});

export const setupResponseInterceptor = (apiClient: AxiosInstance) => {
  apiClient.interceptors.response.use(
    (response: AxiosResponse<ApiResponseType<any>>) => {
      return response.data as any;
    },

    async (error: AxiosError<ApiResponseType<any>>) => {
      const originalRequest: (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined =
        error.config;

      if (!originalRequest) return Promise.reject(error);

      if (
        (error.response?.status === 401 || error.response?.status === 403) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const res =
            await refreshClient.post<ApiResponseType<{ accessToken: string; user: UserType }>>(
              "/api/auth/refresh"
            );

          const data = res.data;

          if (data.success && data.data?.accessToken) {
            const { setAccessToken, setUser, setIsLoggedIn } = useAuthStore.getState();
            setAccessToken(data.data.accessToken);
            setUser(data.data.user);
            setIsLoggedIn(true);

            originalRequest.headers["Authorization"] = `Bearer ${data.data.accessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          const { setAccessToken, setUser, setIsLoggedIn } = useAuthStore.getState();
          setAccessToken("");
          setUser(null);
          setIsLoggedIn(false);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};
