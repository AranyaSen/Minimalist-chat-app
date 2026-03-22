import { UserType } from "@/store/useAuthStore.types";

export type SiginInResponseType = {
  user: UserType;
  accessToken: string;
};
