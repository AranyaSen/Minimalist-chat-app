import { create } from "zustand";
import { UseAuthStoreType, UserType } from "@/store/useAuthStore.types";

export const useAuthStore = create<UseAuthStoreType>((set) => ({
  isLoggedIn: false,
  accessToken: "",
  user: null,
  isCheckingAuth: true,
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
  setUser: (user: UserType | null) => set({ user }),
  setIsCheckingAuth: (isCheckingAuth: boolean) => set({ isCheckingAuth }),
}));
