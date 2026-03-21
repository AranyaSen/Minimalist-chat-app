import { create } from "zustand";
import { UseAuthStoreType, UserType } from "@/store/useAuthStore.types";

export const useAuthStore = create<UseAuthStoreType>((set) => ({
  isLoggedIn: false,
  accessToken: "",
  user: null,
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
  setUser: (user: UserType) => set({ user }),
}));
