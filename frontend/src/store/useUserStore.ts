import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { UserState, DecodedToken } from "@/store/useUserStore.types";

export const useUserStore = create<UserState>((set) => ({
  loginId: "",
  loginName: "",

  setLoginId: (id: string) => set({ loginId: id }),
  setLoginName: (name: string) => set({ loginName: name }),

  initializeAuth: () => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("token="));
    const token = tokenCookie ? tokenCookie.split("=")[1] : null;

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        set({
          loginId: decoded.id,
          loginName: decoded.name,
        });
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  },

  clearAuth: () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    set({ loginId: "", loginName: "" });
  },
}));

export default useUserStore;
