import { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export const setupRequestInterceptor = (apiClient: AxiosInstance) => {
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const { accessToken } = useAuthStore.getState();

      if (accessToken && !config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
