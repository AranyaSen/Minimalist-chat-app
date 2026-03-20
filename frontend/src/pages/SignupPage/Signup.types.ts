export interface SignupResponse {
  message?: string;
}

export interface SignupErrors {
  name?: boolean;
  username?: boolean;
  password?: boolean;
}
