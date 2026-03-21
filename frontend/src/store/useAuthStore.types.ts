export type UserType = {
  id: string;
  fullName: string;
  email: string;
  username: string;
  image: string | undefined;
};

export type UseAuthStoreType = {
  isLoggedIn: boolean;
  accessToken: string;
  user: UserType | null;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: UserType) => void;
};
