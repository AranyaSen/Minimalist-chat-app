import axios from "axios";
import { setupRequestInterceptor } from "./request.interceptor";
import { setupResponseInterceptor } from "./response.interceptor";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:7000",
  withCredentials: true,
});

setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);
