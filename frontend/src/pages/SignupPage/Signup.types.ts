import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export interface SignupResponse {
  message?: string;
}

export interface SignupErrors {
  name?: boolean;
  username?: boolean;
  password?: boolean;
}
