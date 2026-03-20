export interface UserState {
  loginId: string;
  loginName: string;
  setLoginId: (id: string) => void;
  setLoginName: (name: string) => void;
  initializeAuth: () => void;
  clearAuth: () => void;
}

export interface DecodedToken {
  id: string;
  name: string;
  exp: number;
}
